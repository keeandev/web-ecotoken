import {
    DirectSecp256k1HdWallet,
    DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";
import {
    Metaplex,
    bundlrStorage,
    keypairIdentity,
    toMetaplexFile,
    token,
} from "@metaplex-foundation/js";
import { RegenApi } from "@regen-network/api";
import {
    QuerySellOrdersByBatchResponse,
    QueryClientImpl as SellOrderQueryClient,
} from "@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/query.js";
import { MsgBuyDirect } from "@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/tx.js";
import {
    QueryBatchesByProjectResponse,
    QueryClientImpl as QueryBatchesClient,
} from "@regen-network/api/lib/generated/regen/ecocredit/v1/query.js";
import { MsgRetire } from "@regen-network/api/lib/generated/regen/ecocredit/v1/tx.js";
// import TokenStandard
import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
    type Cluster,
} from "@solana/web3.js";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import bs58 from "bs58";
import { z } from "zod";
import { type EcoOrder } from "@ecotoken/db";

import { createEcoOrderSchema, updateEcoOrderSchema } from "../../schema/order";
import { adminAuthedProcedure, authedProcedure, router } from "../../trpc";

export const ordersRouter = router({
    getAll: authedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).optional().default(10),
                cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
                project: z.string().cuid().optional()
            }),
        )
        .query(async ({ ctx, input }) => {
            const orders = await ctx.prisma.ecoOrder.findMany({
                take: input.limit + 1,
                ...(ctx.session.user.type === "user" && {
                    where: {
                        userID: ctx.session.user.id,
                    },
                }),
                where: {
                    ...(input.project && {
                        nftSeries: {
                            projectID: input.project,
                        },
                    }),
                },
                ...(input?.cursor && {
                    cursor: {
                        ecoOrderID: input.cursor,
                    },
                }),
            });
            let nextCursor: EcoOrder | undefined;
            if (orders?.length > input.limit) nextCursor = orders.pop();

            return {
                orders,
                nextCursor,
            };
        }),
    get: authedProcedure
        .input(
            z.object({
                ecoOrderID: z.string(),
                project: z.boolean().optional()
            }),
        )
        .query(async ({ ctx, input: { ecoOrderID, project } }) => {
            return await ctx.prisma.ecoOrder.findFirst({
                where: {
                    ecoOrderID,
                    ...(ctx.session.user.type === "user" && {
                        userID: ctx.session.user.id,
                    }),
                },
                include: {
                    nftSeries: {
                        include: {
                            project,
                        },
                    },
                },
            });
        }),
    create: authedProcedure
        .input(createEcoOrderSchema)
        .mutation(async ({ ctx, input }) => {
            // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
            const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as Cluster;
            if (
                !network ||
                !process.env.SOLANA_ADMIN_WALLET ||
                !process.env.REGEN_WALLET ||
                !process.env.REGEN_ENDPOINT
            )
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Env file error.",
                });
            const secretKey = bs58.decode(process.env.SOLANA_ADMIN_WALLET);
            const wallet = Keypair.fromSecretKey(secretKey);

            // You can also provide a custom RPC endpoint.
            const endpoint = clusterApiUrl(network);

            const connection = new Connection(endpoint, "confirmed");

            const series = await ctx.prisma.nFTSeries.findUnique({
                where: {
                    nftSeriesID: input.nftSeriesID,
                },
                include: {
                    project: true,
                },
            });

            if (!series)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Series for NFT not found.",
                });
            if (!series.project) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Project not found.",
                });
            }

            // check previous tx hash
            const existed = await ctx.prisma.ecoOrder.findFirst({
                where: {
                    payHash: input.payHash,
                },
            });

            if (existed) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You used previous info.",
                });
            }

            let vaildInput = false;
            try {
                const txRes = await axios.get(
                    `https://api.solscan.io/transaction?tx=${input.payHash}&cluster=devnet`,
                );
                if (
                    txRes.data.status === "Success" &&
                    txRes.data.signer[0] === input.userWallet &&
                    txRes.data.mainActions[0].action === "spl-transfer" &&
                    txRes.data.txStatus === "confirmed" &&
                    txRes.data.mainActions[0].data.source_owner ===
                        input.userWallet &&
                    txRes.data.mainActions[0].data.destination_owner ===
                        wallet.publicKey.toString() &&
                    txRes.data.mainActions[0].data.token.address ===
                        process.env.NEXT_PUBLIC_SOLANA_USDC &&
                    txRes.data.mainActions[0].data.amount ===
                        series.creditPrice
                            .times(input.creditsPurchased)
                            .times(1e9)
                ) {
                    vaildInput = true;
                }
            } catch (error) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "That is not real transaction hash.",
                });
            }

            // retire credits
            const sender = process.env.REGEN_WALLET;
            // const signer = await DirectSecp256k1Wallet.fromKey(
            //     Buffer.from(sender.replace("0x", ""), "hex"),
            //     "regen",
            // );
            const signer = await DirectSecp256k1HdWallet.fromMnemonic(sender, {
                prefix: "regen",
            });
            const [account] = await signer.getAccounts();
            if (!account)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });

            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: process.env.REGEN_ENDPOINT,
                        signer,
                    },
                });
                const TEST_MSG_RETIRE = MsgRetire.fromPartial({
                    owner: account.address,
                    credits: [
                        {
                            batchDenom: series.regenBatch,
                            amount: input.creditsPurchased.toString(),
                        },
                    ],
                    jurisdiction: "US-OR",
                });
                const TEST_FEE = {
                    amount: [
                        {
                            denom: "uregen",
                            amount: "5000",
                        },
                    ],
                    gas: "200000",
                };
                const TEST_MEMO = "Retire credits";

                const { msgClient } = regenApi;

                if (!msgClient)
                    throw new TRPCError({
                        message: "Error. Try again.",
                        code: "CONFLICT",
                    });
                console.log(msgClient);

                const signedTxBytes: any = await msgClient.sign(
                    account.address,
                    [TEST_MSG_RETIRE],
                    TEST_FEE,
                    TEST_MEMO,
                );
                console.log("signedTxBytes", signedTxBytes);

                const txRes = await msgClient.broadcast(signedTxBytes);

                console.log("txRes", txRes);

                // return txRes;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error in retiring process. Contact to dev team.",
                    code: "CONFLICT",
                });
            }

            const order = await ctx.prisma.ecoOrder.create({
                data: {
                    ...input,
                    nftSeriesID: series.nftSeriesID,
                    userID:
                        input.userID && ctx.session.user.type === "admin"
                            ? input.userID
                            : ctx.session.user.id,
                    retireWallet: series.recieveWallet,
                    ecoWallet: series.creditWallet,
                    creditKey: series.creditKey,
                    creditWallet: series.creditWallet,
                },
                select: {
                    ecoOrderID: true,
                },
            });

            return order;
        }),
    update: adminAuthedProcedure
        .input(updateEcoOrderSchema)
        .mutation(async ({ ctx, input: { ecoOrderID, ...input } }) => {
            await ctx.prisma.ecoOrder.update({
                where: {
                    ecoOrderID,
                },
                data: {
                    ...input,
                },
            });
        }),
    delete: adminAuthedProcedure
        .input(
            z.object({
                ecoOrderID: z.string(),
            }),
        )
        .mutation(async ({ ctx, input: { ecoOrderID } }) => {
            await ctx.prisma.ecoOrder.delete({
                where: {
                    ecoOrderID,
                },
            });
        }),
});
