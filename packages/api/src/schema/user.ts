import { z } from "zod";

// export const createUserSchema = z.object({
// 	walletAddress: z.string(),
// 	emailAddress: z.string().nullish()
// });

export const createUserSchema = z.object({
	firstName: z
		.string()
		.min(1, "First name is required.")
		.max(32, "First name cannot be longer than 32 characters."),
	lastName: z
		.string()
		.max(32, "Last name cannot be longer than 32 characters.")
		.optional(),
	emailAddress: z.string().email("You must specify a valid email."),
	username: z.string().min(3, "Username must be at least 3 characters."),
	password: z.string().min(8, "Password must be at least 8 characters."),
	confirmPassword: z.string()
});

export const updateUserSchema = createUserSchema
	.partial()
	.catchall(z.literal(""));

export const loginUserSchema = z.object({
	user: z.string().min(1, "Username or email is required."),
	password: createUserSchema.shape.password
});
