import { z } from "zod";

export const createPermissionSchema = z.object({
	domain: z.enum(["ADMIN", "USER"]),
	permission: z.string().min(1, "Permission name is required."),
	description: z.string().nullable()
});

export const updatePermissionSchema = createPermissionSchema
	.extend({
		id: z.string().cuid()
	})
	.partial()
	.catchall(z.literal(""));
