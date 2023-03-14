import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { exclude } from "@ecotoken/db";

import {
    createNFTSeriesSchema,
    editNFTSeriesSchema,
} from "../schema/nft-series";
import { adminAuthedProcedure, router } from "../trpc";

export const nftSeriesRouter = router({
    get: adminAuthedProcedure
        .input(
            z.object({
                nftSeriesID: z.string(),
                project: z.boolean().optional(),
            }),
        )
        .query(async ({ ctx, input: { nftSeriesID, project } }) => {
            const series = await ctx.prisma.nFTSeries.findUnique({
                where: {
                    nftSeriesID,
                },
                include: {
                    project,
                },
            });
            if (!series)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "NFT series not found.",
                });
            return exclude(series, ["creditKey"]);
        }),
    create: adminAuthedProcedure
        .input(createNFTSeriesSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.nFTSeries.create({
                data: {
                    ...input,
                },
                select: {
                    nftSeriesID: true,
                },
            });
        }),
    update: adminAuthedProcedure
        .input(editNFTSeriesSchema)
        .mutation(async ({ ctx, input: { nftSeriesID, ...input } }) => {
            const series = await ctx.prisma.nFTSeries.update({
                where: {
                    nftSeriesID,
                },
                data: {
                    ...input,
                },
                select: {
                    nftSeriesID: true,
                },
            });
            if (!series)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "NFT series not found.",
                });
            return series;
        }),
});
