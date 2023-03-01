import { z } from "zod";

export const createEcoProjectSchema = z.object({
	projectID: z.string().cuid().optional(),
	locationID: z
		.string()
		.cuid()
		.min(1, "Please choose a location for this project."),
	producerID: z.string().cuid(),
	vfyUserID: z.string().cuid().nullish(),
	ecoNftID: z.number(),
	ecoType: z.enum(["FUNDED_PROJECT", "CARBON_CREDIT", "WATER_CREDIT"]),
	ecoTitle: z.string(),
	shortTitle: z
		.string()
		.min(1, "A short title is required to create a project."),
	ecoUrl: z.string().min(1, "Please provide a identifier for your project."),
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
	fundAmount: z.number().nullish(),
	fundRecieved: z.number().nullish(),
	return: z
		.number()
		.min(1, "You must have a return greater than zero.")
		.nullish(),
	payback: z.string().nullish(),
	dateStart: z.date().nullish(),
	dateEnd: z.date().nullish(),
	isVisible: z.boolean()
});

export const editEcoProjectSchema = createEcoProjectSchema
	.partial()
	.catchall(z.literal(""));
