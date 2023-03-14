import type { EcoLocation } from "@prisma/client";
import { z } from "zod";
import {
	createEcoLocationSchema,
	updateEcoLocationSchema
} from "../../schema/location";
import { router, adminAuthedProcedure } from "../../trpc";

export const locationsRouter = router({
	get: adminAuthedProcedure
		.input(
			z.object({
				locationID: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const location = await ctx.prisma.ecoLocation.findFirst({
				where: {
					locationID: input.locationID
				}
			});
			return location;
		}),
	getAll: adminAuthedProcedure
		.input(
			z.object({
				siteID: z.string().optional(),
				limit: z.number().min(1).max(100).nullish().default(10),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input?.limit ?? 50;
			const locations = await ctx.prisma.ecoLocation.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				where: {
					siteID: input.siteID
				},
				...(input?.cursor && {
					cursor: {
						locationID: input.cursor
					}
				})
			});

			let nextCursor: EcoLocation | undefined;
			if (locations?.length > limit) nextCursor = locations.pop();

			return {
				locations,
				nextCursor
			};
		}),
	create: adminAuthedProcedure
		.input(createEcoLocationSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.ecoLocation.create({
				data: {
					...input
				},
				select: {
					locationID: true
				}
			});
		}),
	update: adminAuthedProcedure
		.input(updateEcoLocationSchema)
		.mutation(async ({ ctx, input: { locationID, ...input } }) => {
			await ctx.prisma.ecoLocation.update({
				where: {
					locationID
				},
				data: {
					...input
				}
			});
		}),
	delete: adminAuthedProcedure
		.input(z.object({ locationID: z.string() }))
		.mutation(async ({ ctx, input: { locationID } }) => {
			await ctx.prisma.ecoLocation.delete({
				where: {
					locationID
				}
			});
		})
});
