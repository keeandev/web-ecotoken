import { z } from "zod";

export const updateAdminUserSchema = z
	.object({
		adminID: z.string(),
		firstName: z
			.string()
			.min(1, "You must specify a first name.")
			.optional()
			.or(z.literal("")),
		lastName: z.string().nullish().or(z.literal("")),
		email: z
			.string()
			.email("A valid email is required.")
			.optional()
			.or(z.literal("")),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters.")
			.max(32, "A shorter username is required.")
			.optional()
			.or(z.literal("")),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(64, "A shorter password is required.")
			.optional()
			.or(z.literal("")),
		confirmPassword: z.string().optional().or(z.literal(""))
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				path: ["confirmPassword"],
				code: "custom",
				message: "Passwords don't match!"
			});
		}
	});

export const createAdminUserSchema = z
	.object({
		firstName: z.string().min(1, "You must specify a first name."),
		lastName: z.string().nullish().or(z.literal("")),
		email: z.string().email("A valid email is required."),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters.")
			.max(32, "A shorter username is required."),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(64, "A shorter password is required."),
		confirmPassword: z.string()
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				path: ["confirmPassword"],
				code: "custom",
				message: "Passwords don't match!"
			});
		}
	});
