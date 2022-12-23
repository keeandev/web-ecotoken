import { adminAuthedProcedure, router } from "../../trpc";
import { AdminUser } from "@prisma/client";
import { z } from "zod";

export const adminUsersRouter = router({
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
		})
});
