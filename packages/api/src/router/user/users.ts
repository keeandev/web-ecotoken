import { adminAuthedProcedure, publicProcedure, router } from "../../trpc";
import { User } from "@prisma/client";
import { z } from "zod";
import { createUserSchema } from "../../schema/user";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
	usernameCheck: publicProcedure
		.input(z.object({ username: z.string() }))
		.query(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findUnique({
				where: {
					username: input.username
				}
			});
			if (!user?.id)
				throw new TRPCError({
					message: "Username is not available.",
					code: "CONFLICT"
				});
		}),
	getAll: adminAuthedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const users = await ctx.prisma.user.findMany({
				where: {},
				take: input.limit + 1,
				...(input?.cursor && {
					cursor: {
						id: input.cursor
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
			return await ctx.prisma.user.create({
				data: {
					...input,
					siteID: ctx.currentSite.siteID
				}
			});
		}),
	get: adminAuthedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			return await ctx.prisma.user.findFirst({
				where: {
					id: input.id
				}
			});
		})
});
