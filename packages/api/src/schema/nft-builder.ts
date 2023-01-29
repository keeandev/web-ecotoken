import { z } from "zod";
import { zfd } from "zod-form-data";

export const createNFTSchema = z.object({
	id: z.string(),
	image: z.unknown().optional(),
	credits: z.number().min(1, "An NFT must have at least 1 credit allocated."),
	symbol: z.string(),
	project: z.string(),
	location: z.string(),
	producer: z.string(),
	date: z.date()
});

export const mintNFTSchema = zfd.formData({
    id: z.string(),
	image: zfd.file(),
	credits: z.number().min(1, "An NFT must have at least 1 credit allocated."),
	symbol: z.string(),
	project: z.string(),
	location: z.string(),
	producer: z.string(),
	date: z.date()
});
