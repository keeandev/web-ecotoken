import type { EcoProject } from "@prisma/client";
import { z } from "zod";

import { authedProcedure, router } from "../trpc";

export const projectsRouter = router({
	get: authedProcedure
		.input(
			z.object({
				url: z.string(),
				partners: z.boolean().nullish(),
				benefits: z.boolean().nullish()
			})
		)
		.query(async ({ ctx, input }) => {
			const project = await ctx.prisma.ecoProject.findFirst({
				where: {
					url: input.url
				}
			});
			return project;
		}),
	getAll: authedProcedure
		.input(
			z.object({
				partners: z.boolean().nullish(),
				benefits: z.boolean().nullish(),
				limit: z.number().min(1).max(100).nullish().default(10),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input?.limit ?? 50;
			const projects = await ctx.prisma.ecoProject.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				...(input?.cursor && {
					cursor: {
						id: input.cursor
					}
				}),
				where: {}
			});

			let nextCursor: EcoProject | undefined;
			if (projects?.length > limit) nextCursor = projects.pop();

			return {
				projects,
				nextCursor
			};
		})
});
