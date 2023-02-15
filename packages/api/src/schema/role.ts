import { z } from "zod";

export const createRoleSchema = z.object({
	domain: z.enum(["ADMIN", "USER"]),
	scope: z.enum(["DEFAULT", "SITE"]),
	role: z.string().min(1, "Role name is required."),
	description: z.string().nullable()
});

export const updateRoleSchema = createRoleSchema
	.extend({
		roleID: z.string()
	})
	.partial()
	.catchall(z.literal(""));
