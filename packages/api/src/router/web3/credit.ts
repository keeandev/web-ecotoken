import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { RegenApi } from "@regen-network/api";
import {
    QuerySellOrdersByBatchResponse,
    QueryClientImpl,
} from "@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/query.js";
import { MsgBuyDirect } from "@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/tx.js";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";

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
            const signer = await DirectSecp256k1Wallet.fromKey(
                Buffer.from(sender.replace("0x", ""), "hex"),
                "regen",
            );

            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const queryClient = new QueryClientImpl(regenApi.queryClient);
                const sellOrder = await queryClient.SellOrdersByBatch({
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
    retireCreditFromMarketplace: publicProcedure
        .input(z.object({
            sellOrderId: z.string(),
            quantity: z.string(),
            denom: z.string(),
            amount: z.string(),
            retirementJurisdiction: z.string(),
            memo: z.string()
        }))
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
            const sender = process.env.REGEN_WALLET;
            const signer = await DirectSecp256k1Wallet.fromKey(
                Buffer.from(sender.replace("0x", ""), "hex"),
                "regen",
            );
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
                const TEST_MSG_BUY = MsgBuyDirect.fromPartial({
                    buyer: account.address,
                    orders: [
                        {
                            sellOrderId: input.sellOrderId.toString(),
                            quantity: input.quantity.toString(),
                            bidPrice: { denom: input.denom.toString(), amount: input.amount.toString() },
                            disableAutoRetire: false, // retire only
                            retirementJurisdiction: input.retirementJurisdiction.toString(),
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

                if (!msgClient) throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });

                const signedTxBytes = await msgClient.sign(
                    account.address,
                    [TEST_MSG_BUY],
                    TEST_FEE,
                    input.memo.toString()
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
