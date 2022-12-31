import { z } from "zod";

export const createUserSchema = z.object({
	walletAddress: z.string(),
	emailAddress: z.string().nullish()
});

export const updateUserSchema = createUserSchema.partial();
