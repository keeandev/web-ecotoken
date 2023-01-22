import { router, adminAuthedProcedure } from "../../trpc";
import {
	createPermissionSchema,
	updatePermissionSchema
} from "../../schema/permission";
import { z } from "zod";
import { Permission } from "@ecotoken/db";

export const permissionsRouter = router({
	get: adminAuthedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			return await ctx.prisma.role.findUnique({
				where: {
					roleID: input.id
				}
			});
		}),
	getAll: adminAuthedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				cursor: z.string().nullish()
			})
		)
		.query(async ({ ctx, input }) => {
			const permissions = await ctx.prisma.permission.findMany({
				where: {},
				take: input.limit + 1,
				...(input?.cursor && {
					cursor: {
						permissionID: input.cursor
					}
				})
			});

			let nextCursor: Permission | undefined;
			if (permissions?.length > input.limit)
				nextCursor = permissions.pop();

			return {
				permissions,
				nextCursor
			};
		}),
	create: adminAuthedProcedure
		.meta({
			requiredPermissions: ["PERMISSION_CONFIG"]
		})
		.input(createPermissionSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.permission.create({
				data: {
					...input
				}
			});
		}),
	update: adminAuthedProcedure
		.meta({ requiredPermissions: ["PERMISSION_CONFIG"] })
		.input(updatePermissionSchema)
		.mutation(async ({ ctx, input: { id, ...input } }) => {
			return await ctx.prisma.role.update({
				where: {
					roleID: id
				},
				data: {
					...input
				}
			});
		})
});
