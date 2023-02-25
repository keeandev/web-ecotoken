import { z } from "zod";

export const createEcoProjectSchema = z.object({
	locationID: z.string(),
    siteID: z.string(),
	prdUserID: z.string().nullable(),
	vfyUserID: z.string().nullable(),
	ecoNftID: z.number(),
	ecoType: z.enum(["FUNDED_PROJECT", "CARBON_CREDIT", "WATER_CREDIT"]),
	ecoTitle: z.string(),
	shortTitle: z.string(),
	ecoUrl: z.string(),
	intro: z.string(),
	project: z.string(),
	overview: z.string(),
	status: z.enum(["PENDING", "COMPLETE", "FUNDED", "OPEN"]),
	images: z.object({
		listImage: z.string(),
		headOne: z.string(),
		headTwo: z.string(),
		headThree: z.string()
	}),
	fundAmount: z.number().nullable(),
	fundRecieved: z.number().nullable(),
	return: z.number().nullable(),
	payback: z.string().nullable(),
	dateStart: z.date().nullable(),
	dateEnd: z.date().nullable(),
	isVisible: z.boolean()
});

export const editEcoProjectSchema = createEcoProjectSchema
	.partial()
	.catchall(z.literal(""));
