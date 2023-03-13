import { z } from "zod";

import { decimal } from "./utils";

export const ecoProjectEnumSchema = z.object({
    status: z.enum(["DATA_ENTRY", "NEW", "UNFUNDED", "ACTIVE", "COMPLETED"]),
    creditType: z.enum(["CARBON", "WATER", "HABITAT"]),
});

export const createEcoProjectSchema = z.object({
    // temporary fix for cuid to cuid2 migration for prisma
    projectID: z.union([z.string().cuid2(), z.string().cuid()]).optional(),
    title: z.string().min(1, "A title is required to create a project."),
    shortTitle: z
        .string()
        .min(1, "A short title is required to create a project."),
    identifier: z
        .string()
        .min(1, "Please provide a identifier for your project."),
    intro: z.string().optional(),
    project: z.string().optional(),
    overview: z.string().optional(),
    process: z.string().optional(),
    creditType: ecoProjectEnumSchema.shape.creditType,
    status: ecoProjectEnumSchema.shape.status,
    producerID: z
        .string()
        .cuid()
        .min(1, "Please choose a producer for this project."),
    verifierID: z.string().cuid().nullish(),
    listImage: z.string().optional(),
    headImage: z.string().optional(),
    fundAmount: z.number().nullish(),
    fundRecieved: z.number().nullish(),
    return: decimal(5, 2).nullish(),
    payback: decimal(5, 2).nullish(),
    duration: z.string().nullish(),
    period: z.string().nullish(),
    dateStart: z.date().nullish(),
    dateEnd: z.date().nullish(),
    needsFunding: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    isVisible: z.boolean().default(false),
});

export const editEcoProjectSchema = z.object({
    // temporary fix for cuid to cuid2 migration for prisma
    projectID: z.union([z.string().cuid2(), z.string().cuid()]),
    title: z.string().optional(),
    shortTitle: z.string().optional(),
    identifier: z.string().optional(),
    intro: z.string().optional(),
    project: z.string().optional(),
    overview: z.string().optional(),
    process: z.string().optional(),
    creditType: z.enum(["CARBON", "WATER", "HABITAT"]).optional(),
    status: z
        .enum(["DATA_ENTRY", "NEW", "UNFUNDED", "ACTIVE", "COMPLETED"])
        .optional(),
    locationID: z.string().cuid().optional(),
    producerID: z.string().cuid().optional(),
    verifierID: z.string().cuid().nullish(),
    listImage: z.string().optional(),
    headImage: z.string().optional(),
    fundAmount: z.number().nullish(),
    fundRecieved: z.number().nullish(),
    return: decimal(5, 2).nullish(),
    payback: decimal(5, 2).nullish(),
    duration: z.string().nullish(),
    period: z.string().nullish(),
    dateStart: z.date().nullish(),
    dateEnd: z.date().nullish(),
    needsFunding: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isVisible: z.boolean().optional(),
});
