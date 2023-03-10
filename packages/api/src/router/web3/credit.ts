import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { RegenApi } from "@regen-network/api";
import {
    QuerySellOrdersByBatchResponse,
    QueryClientImpl as SellOrderQueryClient,
} from "@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/query.js";

import {
    QueryBatchesByProjectResponse,
    QueryClientImpl as QueryBatchesClient,
} from "@regen-network/api/lib/generated/regen/ecocredit/v1/query.js";
import { MsgBuyDirect } from "@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/tx.js";
import { MsgRetire } from "@regen-network/api/lib/generated/regen/ecocredit/v1/tx.js";
import {
    DirectSecp256k1Wallet,
    DirectSecp256k1HdWallet,
} from "@cosmjs/proto-signing";

export const creditRouter = router({
    getSellOrderByBatch: publicProcedure
        .input(z.object({ batch: z.string() }))
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
            const sender = process.env.REGEN_WALLET;
            // const signer = await DirectSecp256k1Wallet.fromKey(
            //     Buffer.from(sender.replace("0x", ""), "hex"),
            //     "regen",
            // );

            const signer = await DirectSecp256k1HdWallet.fromMnemonic(sender, {
                prefix: "regen",
            });

            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const queryClient = new SellOrderQueryClient(
                    regenApi.queryClient,
                );
                const sellOrder: any = await queryClient.SellOrdersByBatch({
                    batchDenom: input.batch,
                });
                console.log(sellOrder);
                return sellOrder;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });
            }
        }),
    getCreditsByProject: publicProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
            const sender = process.env.REGEN_WALLET;
            // const signer = await DirectSecp256k1Wallet.fromKey(
            //     Buffer.from(sender.replace("0x", ""), "hex"),
            //     "regen",
            // );

            const signer = await DirectSecp256k1HdWallet.fromMnemonic(sender, {
                prefix: "regen",
            });

            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const queryClient = new QueryBatchesClient(
                    regenApi.queryClient,
                );
                const batches: any = await queryClient.BatchesByProject({
                    projectId: input.projectId,
                });
                console.log(batches);
                return batches.batches;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });
            }
        }),
    retireCreditFromMarketplace: publicProcedure
        .input(
            z.object({
                sellOrderId: z.string(),
                quantity: z.string(),
                denom: z.string(),
                amount: z.string(),
                retirementJurisdiction: z.string(),
                memo: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
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
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const TEST_MSG_BUY: any = MsgBuyDirect.fromPartial({
                    buyer: account.address,
                    orders: [
                        {
                            sellOrderId: input.sellOrderId.toString(),
                            quantity: input.quantity.toString(),
                            bidPrice: {
                                denom: input.denom.toString(),
                                amount: input.amount.toString(),
                            },
                            disableAutoRetire: false, // retire only
                            retirementJurisdiction:
                                input.retirementJurisdiction.toString(),
                        },
                    ],
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

                const { msgClient } = regenApi;

                if (!msgClient)
                    throw new TRPCError({
                        message: "Error. Try again.",
                        code: "CONFLICT",
                    });

                const signedTxBytes: any = await msgClient.sign(
                    account.address,
                    [TEST_MSG_BUY],
                    TEST_FEE,
                    input.memo.toString(),
                );
                console.log("signedTxBytes", signedTxBytes);

                const txRes = await msgClient.broadcast(signedTxBytes);

                console.log("txRes", txRes);

                return txRes;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });
            }
        }),
    retireAdminCredit: publicProcedure
        .input(
            z.object({
                batch: z.string(),
                quantity: z.string(),
                memo: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
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
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const TEST_MSG_RETIRE = MsgRetire.fromPartial({
                    owner: account.address,
                    credits: [
                        {
                            batchDenom: input.batch,
                            amount: input.quantity,
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

                const { msgClient } = regenApi;

                if (!msgClient)
                    throw new TRPCError({
                        message: "Error. Try again.",
                        code: "CONFLICT",
                    });

                const signedTxBytes: any = await msgClient.sign(
                    account.address,
                    [TEST_MSG_RETIRE],
                    TEST_FEE,
                    input.memo.toString(),
                );
                console.log("signedTxBytes", signedTxBytes);

                const txRes = await msgClient.broadcast(signedTxBytes);

                console.log("txRes", txRes);

                return txRes;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });
            }
        }),
});
