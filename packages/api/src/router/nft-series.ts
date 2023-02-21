import { createNFTSeriesSchema } from "../schema/nft-series";
import { router, adminAuthedProcedure } from "../trpc";

export const nftSeriesRouter = router({
	create: adminAuthedProcedure
		.input(createNFTSeriesSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.nFTSeries.create({
                data: {
                    ...input
                }
            });
		})
});
