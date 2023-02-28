import { z } from "zod";

export const createUserSchema = z.object({
	roleID: z.string().cuid().min(1, "A role is required."),
	companyName: z.string().nullish(),
	firstName: z
		.string()
		.min(1, "First name is required.")
		.max(32, "First name cannot be longer than 32 characters."),
	lastName: z
		.string()
		.max(32, "Last name cannot be longer than 32 characters.")
		.nullish(),
	email: z.string().email("You must specify a valid email."),
	username: z.string().min(3, "Username must be at least 3 characters."),
	password: z.string().min(8, "Password must be at least 8 characters."),
	confirmPassword: z.string()
});

export const updateUserSchema = z.object({
	userID: z.string().cuid(),
	roleID: z.string().cuid().optional().or(z.literal("")),
	companyName: z.string().nullish().or(z.literal("")),
	firstName: z
		.string()
		.min(1, "First name is required.")
		.max(32, "First name cannot be longer than 32 characters.")
		.optional()
		.or(z.literal("")),
	lastName: z
		.string()
		.max(32, "Last name cannot be longer than 32 characters.")
		.nullish()
		.or(z.literal("")),
	email: z
		.string()
		.email("You must specify a valid email.")
		.optional()
		.or(z.literal("")),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.optional()
		.or(z.literal("")),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters.")
		.optional()
		.or(z.literal("")),
	confirmPassword: z.string().optional().or(z.literal(""))
});

export const loginUserSchema = z.object({
	user: z.union([z.string(), z.string().email()]),
	password: z.string()
});
