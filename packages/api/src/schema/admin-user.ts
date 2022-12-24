import { z } from "zod";

export const updateUserSchema = z.object({
	id: z.string(),
	firstName: z.string().min(1, "You must specify a first name.").optional(),
	lastName: z.string().optional(),
	email: z.string().email("A valid email is required.").optional(),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.max(32, "A shorter username is required.")
		.optional(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters.")
		.max(64, "A shorter password is required.")
		.optional()
});

export const createUserSchema = z.object({
	firstName: z.string().min(1, "You must specify a first name."),
	lastName: z.string().optional(),
	email: z.string().email("A valid email is required."),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.max(32, "A shorter username is required."),
	password: z.string()
});
