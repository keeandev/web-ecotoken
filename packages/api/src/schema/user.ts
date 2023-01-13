import { z } from "zod";

// export const createUserSchema = z.object({
// 	walletAddress: z.string(),
// 	emailAddress: z.string().nullish()
// });

export const createUserSchema = z.object({
	email: z.string().email("You must specify a valid email."),
	username: z.string().min(3, "Username must be at least 3 characters."),
	password: z.string().min(8, "Password must be at least 8 characters.")
});

export const updateUserSchema = createUserSchema.partial();
