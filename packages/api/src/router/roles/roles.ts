import { router, adminAuthedProcedure } from "../../trpc";
import { createRoleSchema, updateRoleSchema } from "../../schema/role";
import { z } from "zod";
import { Role } from "@ecotoken/db";

export const rolesRouter = router({
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
			const roles = await ctx.prisma.role.findMany({
				where: {},
				take: input.limit + 1,
				...(input?.cursor && {
					cursor: {
						roleID: input.cursor
					}
				})
			});

			let nextCursor: Role | undefined;
			if (roles?.length > input.limit) nextCursor = roles.pop();

			return {
				roles,
				nextCursor
			};
		}),
	create: adminAuthedProcedure
		.meta({
			requiredPermissions: ["ROLES_CONFIG"]
		})
		.input(createRoleSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.role.create({
				data: {
					...input
				}
			});
		}),
	update: adminAuthedProcedure
		.meta({ requiredPermissions: ["ROLES_CONFIG"] })
		.input(updateRoleSchema)
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
