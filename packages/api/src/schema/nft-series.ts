import { z } from "zod";

import { decimal } from "./utils";

export const createNFTSeriesSchema = z.object({
    // temporary fix for cuid to cuid2 migration for prisma
    nftSeriesID: z.union([z.string().cuid(), z.string().cuid2()]).optional(),
    projectID: z
        .string()
        .min(1, "A project is required to create an NFT series."),
    seriesName: z.string().min(1, "A series name is required."),
    seriesImage: z.string(),
    seriesNumber: z.number().min(0, "A positive series number is required."),
    seriesType: z.string().min(1, "A series type is required."),
    retireWallet: z.string().min(1, "This wallet address is required."),
    recieveWallet: z.string().min(1, "This wallet address is required."),
    creditWallet: z.string().min(1, "This wallet address is required."),
    creditKey: z
        .string()
        .min(
            1,
            "A credit wallet private key is required for this series to operate.",
        ),
    setAmount: decimal(12, 6),
    totalCredits: decimal(12, 6),
    creditPrice: decimal(12, 6),
    regenBatch: z
        .string()
        .min(1, "A regen batch is required to create a NFT series."),
    isActive: z.boolean().default(true),
});

export const editNFTSeriesSchema = z.object({
    // temporary fix for cuid to cuid2 migration for prisma
    nftSeriesID: z.union([z.string().cuid(), z.string().cuid2()]),
    projectID: z.string().cuid().optional(),
    seriesName: z.string().optional(),
    seriesImage: z.string().optional(),
    seriesNumber: z.number().optional(),
    seriesType: z.string().optional(),
    retireWallet: z.string().optional(),
    recieveWallet: z.string().optional(),
    creditWallet: z.string().optional(),
    creditKey: z.string().optional(),
    setAmount: decimal(12, 6).optional(),
    totalCredits: decimal(12, 6).optional(),
    creditPrice: decimal(12, 6).optional(),
    regenBatch: z.string().optional(),
    isActive: z.boolean().optional(),
});
