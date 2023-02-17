import { z } from "zod";

export const createNFTSeriesSchema = z.object({
	projectID: z.string().min(1, "A project is required to create a series."),
	seriesName: z.string().min(1, "A series name is required."),
	seriesImage: z.string().url("Please specify a base image URL."),
	seriesNumber: z.number().min(0, "A positive series number is required."),
	seriesType: z.enum([
		"CARBON_CREDIT",
		"WATER_CREDIT",
		"BIODIVERSITY",
		"STEWARDSHIP"
	]),
	recieveWallet: z.string().min(1, "This wallet address is required."),
	creditWallet: z.string().min(1, "This wallet address is required."),
	producerWallet: z.string().min(1, "This wallet address is required."),
	producerName: z.string().min(1, "This wallet address is required.")
});
