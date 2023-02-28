import { adminAuthedProcedure, router } from "../../trpc";
import { AdminUser } from "@prisma/client";
import {
	createAdminUserSchema,
	updateAdminUserSchema
} from "@ecotoken/api/src/schema/admin-user";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { exclude } from "@ecotoken/db";

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
			if (adminUser) return exclude(adminUser, ["password"]);
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
				where: {
					isDelete: false
				},
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
		.input(createAdminUserSchema)
		.mutation(async ({ ctx, input }) => {
			delete (input as Partial<typeof input>).confirmPassword;
			const role = await ctx.prisma.role.findFirst({
				where: {
					OR: [
						{
							sites: {
								some: {
									siteID: ctx.selectedSite?.siteID
								}
							},
							scope: "SITE"
						},
						{
							domain: {
								equals: "ADMIN"
							},
							scope: "DEFAULT"
						}
					]
				}
			});
			if (role) {
				return exclude(
					await ctx.prisma.adminUser.create({
						data: {
							...input
						}
					}),
					["password"]
				);
			} else
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Role not found. Creation process cannot proceed."
				});
		}),
	update: adminAuthedProcedure
		.input(updateAdminUserSchema)
		.mutation(async ({ ctx, input: { adminID, ...input } }) => {
			delete (input as Partial<typeof input>).confirmPassword;
			await ctx.prisma.adminUser.update({
				where: {
					adminID
				},
				data: {
					...input
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
			await ctx.prisma.adminUser.update({
				where: {
					adminID: input.id
				},
				data: {
					isDelete: true
				}
			});
		})
});
