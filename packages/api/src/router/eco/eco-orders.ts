import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type EcoOrder } from "@ecotoken/db";

import { createEcoOrderSchema, updateEcoOrderSchema } from "../../schema/order";
import { adminAuthedProcedure, authedProcedure, router } from "../../trpc";

export const ordersRouter = router({
    getAll: authedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).optional().default(10),
                cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
            }),
        )
        .query(async ({ ctx, input }) => {
            const orders = await ctx.prisma.ecoOrder.findMany({
                take: input.limit + 1,
                ...(ctx.session.user.type === "user" && {
                    where: {
                        userID: ctx.session.user.id,
                    },
                }),
                ...(input?.cursor && {
                    cursor: {
                        ecoOrderID: input.cursor,
                    },
                }),
            });
            let nextCursor: EcoOrder | undefined;
            if (orders?.length > input.limit) nextCursor = orders.pop();

            return {
                orders,
                nextCursor,
            };
        }),
    get: authedProcedure
        .input(
            z.object({
                ecoOrderID: z.string(),
                project: z.boolean().optional(),
            }),
        )
        .query(async ({ ctx, input: { ecoOrderID, project } }) => {
            return await ctx.prisma.ecoOrder.findFirst({
                where: {
                    ecoOrderID,
                    ...(ctx.session.user.type === "user" && {
                        userID: ctx.session.user.id,
                    }),
                },
                include: {
                    nftSeries: {
                        include: {
                            project,
                        },
                    },
                },
            });
        }),
    create: authedProcedure
        .input(createEcoOrderSchema)
        .mutation(async ({ ctx, input }) => {
            const series = await ctx.prisma.nFTSeries.findUnique({
                where: {
                    nftSeriesID: input.nftSeriesID,
                },
                include: {
                    project: true,
                },
            });

            if (!series)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Series for NFT not found.",
                });
            if (!series.project) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Project not found.",
                });
            }

            const existed = await ctx.prisma.ecoOrder.findFirst({
                where: {
                    payHash: input.payHash,
                },
            });

            console.log(existed);

            const order = await ctx.prisma.ecoOrder.create({
                data: {
                    ...input,
                    nftSeriesID: series.nftSeriesID,
                    userID:
                        input.userID && ctx.session.user.type === "admin"
                            ? input.userID
                            : ctx.session.user.id,
                    retireWallet: series.recieveWallet,
                    ecoWallet: series.creditWallet,
                    creditKey: series.creditKey,
                    creditWallet: series.creditWallet,
                },
                select: {
                    ecoOrderID: true,
                },
            });

            return order;
        }),
    update: adminAuthedProcedure
        .input(updateEcoOrderSchema)
        .mutation(async ({ ctx, input: { ecoOrderID, ...input } }) => {
            await ctx.prisma.ecoOrder.update({
                where: {
                    ecoOrderID,
                },
                data: {
                    ...input,
                },
            });
        }),
    delete: adminAuthedProcedure
        .input(
            z.object({
                ecoOrderID: z.string(),
            }),
        )
        .mutation(async ({ ctx, input: { ecoOrderID } }) => {
            await ctx.prisma.ecoOrder.delete({
                where: {
                    ecoOrderID,
                },
            });
        }),
});
