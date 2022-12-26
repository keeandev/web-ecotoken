import { adminAuthedProcedure, router } from "../../trpc";
import { AdminUser } from "@prisma/client";
import {
	createUserSchema,
	updateUserSchema
} from "@ecotoken/api/src/schema/admin-user";
import { z } from "zod";

export const adminUsersRouter = router({
	get: adminAuthedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const adminUser = await ctx.prisma.adminUser.findFirst({
				where: {
					adminID: input.id
				}
			});
			return adminUser;
		}),
	getAll: adminAuthedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const adminUsers = await ctx.prisma.adminUser.findMany({
				where: {},
				take: input.limit + 1,
				...(input?.cursor && {
					cursor: {
						adminID: input.cursor
					}
				})
			});

			let nextCursor: AdminUser | undefined;
			if (adminUsers?.length > input.limit) nextCursor = adminUsers.pop();

			return {
				adminUsers,
				nextCursor
			};
		}),
	create: adminAuthedProcedure
		.input(createUserSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.adminUser.create({
				data: {
					firstName: input.firstName,
					lastName: input.lastName,
					email: input.email,
					username: input.username,
					password: input.password
				}
			});
		}),
	update: adminAuthedProcedure
		.input(updateUserSchema)
		.mutation(async ({ ctx, input }) => {
			console.log(JSON.stringify(input));
			await ctx.prisma.adminUser.update({
				where: {
					adminID: input.id
				},
				data: {
					...(!!input.firstName && { firstName: input.firstName }),
					...(!!input.lastName && { lastName: input.lastName }),
					...(!!input.email && { email: input.email }),
					...(!!input.username && { username: input.username }),
					...(!!input.password && { password: input.password })
				}
			});
		}),
	delete: adminAuthedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.adminUser.delete({
				where: {
					adminID: input.id
				}
			});
		})
});
