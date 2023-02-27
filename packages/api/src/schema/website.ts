import { z } from "zod";

export const createWebsiteSchema = z.object({
	siteName: z
		.string({
			required_error: "A site name is required."
		})
		.min(1, "Please specify a site name."),
	prodUrl: z.string().nullish().or(z.literal("")),
	stageUrl: z.string().nullish().or(z.literal("")),
	devUrl: z.string().nullish().or(z.literal(""))
});

export const updateWebsiteSchema = z.object({
	siteID: z.string().cuid(),
	siteName: z.string().optional(),
	legalName: z.string().nullish().or(z.literal("")),
	mailAddress: z.string().nullish().or(z.literal("")),
	prodUrl: z.string().nullish().or(z.literal("")),
	stageUrl: z.string().nullish().or(z.literal("")),
	devUrl: z.string().nullish().or(z.literal(""))
});
