import { adminAuthedProcedure, publicProcedure, router } from "../../trpc";
import { User } from "@prisma/client";
import { z } from "zod";
import { createUserSchema, updateUserSchema } from "../../schema/user";
import { TRPCError } from "@trpc/server";
import { exclude } from "@ecotoken/db";

export const usersRouter = router({
	usernameCheck: publicProcedure
		.input(z.object({ username: z.string() }))
		.query(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findUnique({
				where: {
					username_siteID: {
						username: input.username,
						siteID: ctx.currentSite.siteID
					}
				}
			});
			if (!user?.userID)
				throw new TRPCError({
					message: "Username is not available.",
					code: "CONFLICT"
				});
		}),
	get: adminAuthedProcedure
		.input(
			z.object({
				userID: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findFirst({
				where: {
					userID: input.userID
				}
			});
			if (user) return exclude(user, ["password"]);
			else
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found."
				});
		}),
	getAll: adminAuthedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				role: z.union([z.string().array(), z.string()]).optional(),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const users = await ctx.prisma.user.findMany({
				where: {
					siteID: ctx.selectedSite?.siteID,
					...(input.role && {
						role: {
							...(typeof input.role === "string"
								? {
										role: input.role
								  }
								: {
										OR: input.role.map((role) => ({
											role
										}))
								  })
						}
					})
				},
				include: {
					role: !!input.role
				},
				take: input.limit + 1,
				...(input?.cursor && {
					cursor: {
						userID: input.cursor
					}
				})
			});

			let nextCursor: User | undefined;
			if (users?.length > input.limit) nextCursor = users.pop();

			return {
				users,
				nextCursor
			};
		}),
	create: adminAuthedProcedure
		.input(createUserSchema)
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
								equals: "USER"
							},
							scope: "DEFAULT"
						}
					]
				}
			});
			if (role) {
				return exclude(
					await ctx.prisma.user.create({
						data: {
							...input,
							siteID: ctx.selectedSite?.siteID ?? "",
							roleID: role.roleID
						}
					}),
					["password"]
				);
			} else
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Role not found. Creation process cannot proceed."
				});
		}),
	update: adminAuthedProcedure
		.input(updateUserSchema)
		.mutation(async ({ ctx, input: { userID, ...input } }) => {
            delete (input as Partial<typeof input>).confirmPassword;
			await ctx.prisma.user.update({
				where: {
					userID
				},
				data: {
					...input
				}
			});
		}),
	delete: adminAuthedProcedure
		.input(
			z.object({
				userID: z.string()
			})
		)
		.mutation(async ({ ctx, input: { userID } }) => {
			await ctx.prisma.user.update({
				where: {
					userID
				},
				data: {
					isDelete: true
				}
			});
		})
});
