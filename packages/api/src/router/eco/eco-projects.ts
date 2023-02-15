import type { EcoProject } from "@prisma/client";
import { z } from "zod";

import { userAuthedProcedure, router } from "../../trpc";

export const projectsRouter = router({
	get: userAuthedProcedure
		.input(
			z.object({
				url: z.string(),
				benefits: z.boolean().optional(),
				location: z.boolean().optional()
			})
		)
		.query(async ({ ctx, input }) => {
			const project = await ctx.prisma.ecoProject.findFirst({
				where: {
					ecoUrl: input.url
				},
				include: {
					benefits: input.benefits,
					location: input.location
				}
			});
			return project;
		}),
	getAll: userAuthedProcedure
		.input(
			z.object({
				benefits: z.boolean().optional(),
				location: z.boolean().optional(),
				limit: z.number().min(1).max(100).nullish().default(10),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input?.limit ?? 50;
			const projects = await ctx.prisma.ecoProject.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				include: {
					benefits: input.benefits,
					location: input.location
				},
				...(input?.cursor && {
					cursor: {
						projectID: input.cursor
					}
				})
			});

			let nextCursor: EcoProject | undefined;
			if (projects?.length > limit) nextCursor = projects.pop();

			return {
				projects,
				nextCursor
			};
		})
});