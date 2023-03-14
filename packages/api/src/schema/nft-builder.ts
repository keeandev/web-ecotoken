import { z } from "zod";

export const createNFTSchema = z.object({
    nftSeriesID: z.string().cuid(),
    credits: z.number().min(1, "An NFT must have at least 1 credit allocated."),
    retiredBy: z
        .string()
        .min(1, "Please enter a name for the credit to be retired by."),
});
