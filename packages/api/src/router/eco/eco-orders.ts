import { EcoOrder } from "@ecotoken/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createEcoOrderSchema } from "../../schema/order";
import { router, adminAuthedProcedure, authedProcedure } from "../../trpc";

export const ordersRouter = router({
	getAll: authedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const orders = await ctx.prisma.ecoOrder.findMany({
				take: input.limit + 1,
				...(ctx.session.user.type === "user" && {
					where: {
						userID: ctx.session.user.id
					}
				}),
				...(input?.cursor && {
					cursor: {
						ecoOrderID: input.cursor
					}
				})
			});
			let nextCursor: EcoOrder | undefined;
			if (orders?.length > input.limit) nextCursor = orders.pop();

			return {
				orders,
				nextCursor
			};
		}),
	get: adminAuthedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			return await ctx.prisma.ecoOrder.findFirst({
				where: {
					ecoOrderID: input.id
				}
			});
		}),
	create: adminAuthedProcedure
		.input(createEcoOrderSchema)
		.mutation(async ({ ctx, input }) => {
			const series = await ctx.prisma.nFTSeries.findUnique({
				where: {
					nftSeriesID: input.nftID
				},
				include: {
					project: true
				}
			});

			if (!series) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Series for NFT not found."
				});
			}

			await ctx.prisma.ecoOrder.create({
				data: {
					...input,
					projectID: series.projectID,
					shortTitle: series.project.shortTitle,
					userID: ctx.session.user.id ?? "",
					orderStatus: "FUNDS_RECIEVED",
					creditType: series.seriesType,
					retireWallet: series.recieveWallet,
					ecoWallet: series.creditWallet,
					nftBkgd: series.seriesImage,
                    creditKey: series.creditKey,
                    creditWallet: series.creditWallet
				}
			});
		})
});
