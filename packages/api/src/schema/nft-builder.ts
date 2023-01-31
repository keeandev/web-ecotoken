import { z } from "zod";

export const createNFTSchema = z.object({
	id: z.string(),
	image: z.string(),
	credits: z.number().min(1, "An NFT must have at least 1 credit allocated."),
	symbol: z.string(),
	project: z.string(),
	location: z.string(),
	producer: z.string(),
	date: z.date()
});
