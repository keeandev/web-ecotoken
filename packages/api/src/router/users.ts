import { adminAuthedProcedure, router } from "../trpc";
import { User } from "@prisma/client";
import { z } from "zod";

export const usersRouter = router({
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
		})
});
