import { z } from "zod";
import { exclude } from "@ecotoken/db";

import { createEcoProjectSchema } from "../../schema/project";
import { adminAuthedProcedure, publicProcedure, router } from "../../trpc";

export const projectsRouter = router({
    get: publicProcedure
        .input(
            z.object({
                identifier: z.string(),
                benefits: z.boolean().optional(),
                location: z.boolean().optional(),
                producer: z.boolean().optional(),
                series: z.boolean().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const project = await ctx.prisma.ecoProject.findFirst({
                where: {
                    identifier: input.identifier,
                    siteID: ctx.selectedSite?.siteID ?? ctx.currentSite.siteID,
                },
                include: {
                    benefits: input.benefits,
                    location: input.location,
                    producer: input.producer,
                    nftSeries: input.series,
                },
            });
            console.log("project", project);
            return project;
        }),
    getAll: publicProcedure
        .input(
            z.object({
                benefits: z.boolean().optional(),
                location: z.boolean().optional(),
                series: z.boolean().optional(),
                limit: z.number().min(1).max(100).nullish().default(10),
                cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
            }),
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 50;
            const databaseProjects = await ctx.prisma.ecoProject.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                where: {
                    siteID: ctx.selectedSite?.siteID ?? ctx.currentSite.siteID,
                },
                include: {
                    benefits: input.benefits,
                    location: input.location,
                    nftSeries: input.series,
                },
                ...(input?.cursor && {
                    cursor: {
                        projectID: input.cursor,
                    },
                }),
            });

            const projects = databaseProjects.map((project) =>
                exclude(project, ["siteID"]),
            );

            return {
                projects,
                ...(projects?.length > limit
                    ? { nextCursor: projects.pop() }
                    : {}),
            };
        }),
    create: adminAuthedProcedure
        .input(createEcoProjectSchema)
        .mutation(async ({ ctx, input }) => {
            // await ctx.prisma.ecoProject.create({
            //     data: {
            //         ...input,
            //         siteID: ctx.selectedSite?.siteID ?? ctx.currentSite.siteID,
            //     },
            // });
        }),
});
