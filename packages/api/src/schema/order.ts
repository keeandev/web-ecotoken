import { z } from "zod";

import { decimal } from "./utils";

export const createEcoOrderSchema = z.object({
    nftSeriesID: z
        .string()
        .cuid()
        .min(1, "A project series is required to create an order."),
    userID: z.string().optional(),
    retireBy: z.string().min(1, "Please enter your name."),
    userWallet: z.string(),
    creditsPurchased: decimal(12, 6),
    currency: z.enum(["SOL", "USDC"]),
    payAmount: z.number(),
    payFee: decimal(12, 6),
    payHash: z.string(),
});

export const ecoOrderStatus = z.object({
    orderStatus: z.enum([
        "PROCESSING",
        "FUNDS_RECIEVED",
        "REQUEST_TO_RETIRE",
        "CREDITS_RETIRED",
        "NFT_BEING_MINTED",
        "NFT_IN_YOUR_WALLET",
        "ORDER_COMPLETE",
    ]),
});

export const updateEcoOrderSchema = z.object({
    ecoOrderID: z.string().cuid(),
    retireHash: z.string().nullish(),
    retireFee: z.number().nullish(),
    orderStatus: ecoOrderStatus.shape.orderStatus.optional(),
});
