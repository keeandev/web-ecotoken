import { Site } from "@ecotoken/db";
import { z } from "zod";
import { createWebsiteSchema, updateWebsiteSchema } from "../../schema/website";
import { adminAuthedProcedure, router } from "../../trpc";

export const websiteRouter = router({
	getAll: adminAuthedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				cursor: z.string().nullish()
			})
		)
		.query(async ({ ctx, input }) => {
			const websites = await ctx.prisma.site.findMany({
				take: input.limit + 1,
				...(input.cursor && {
					cursor: {
						siteID: input.cursor
					}
				})
			});

			let nextCursor: Site | undefined;
			// only create a next cursor when there is enough websites in the database to satify
			// the limit as well as the extra taken for the nextCursor
			if (websites.length > input.limit) nextCursor = websites.pop();

			return {
				websites,
				nextCursor
			};
		}),
	get: adminAuthedProcedure
		.input(z.object({ siteID: z.string() }))
		.query(async ({ ctx, input: { siteID } }) => {
			return await ctx.prisma.site.findUnique({
				where: {
					siteID
				}
			});
		}),
	create: adminAuthedProcedure
		.input(createWebsiteSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.site.create({
				data: {
					...input
				}
			});
		}),
	update: adminAuthedProcedure
		.input(updateWebsiteSchema)
		.mutation(async ({ ctx, input: { siteID, ...input } }) => {
			return await ctx.prisma.site.update({
				where: {
					siteID
				},
				data: {
					...input
				}
			});
		}),
	delete: adminAuthedProcedure
		.input(z.object({ siteID: z.string() }))
		.mutation(async ({ ctx, input: { siteID } }) => {
			return await ctx.prisma.site.delete({
				where: {
					siteID
				}
			});
		}),
	updateSelectedSite: adminAuthedProcedure
		.input(z.object({ siteID: z.string() }))
		.mutation(async ({ ctx, input }) => {
			ctx.adminSession.user = {
				id: ctx.adminSession.user?.id ?? "",
				ipAddress:
					process.env.NODE_ENV === "production"
						? ctx.req.connection.remoteAddress ?? ""
						: undefined,
				selectedSite: input.siteID
			};
			await ctx.adminSession.save();
			console.log(ctx.adminSession.user);
			return 200;
		}),
	getCurrentSite: adminAuthedProcedure.query(async ({ ctx }) => {
		return ctx.currentSite?.siteID;
	}),
	getSelectedSite: adminAuthedProcedure.query(async ({ ctx }) => {
		return ctx.adminSession.user?.selectedSite;
	})
});
