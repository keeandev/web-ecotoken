import type { EcoOrderStatus } from "@ecotoken/db";
import { z } from "zod";

export const createEcoOrderSchema = z.object({
	retireBy: z.string(),
	userLocation: z.string(),
	userWallet: z.string(),
	creditAmount: z.number().min(1, "You must purchase at least one credit."),
	payType: z.enum(["SOL", "USDC"]),
	payAmount: z.number(),
	payFee: z.number(),
	payHash: z.string(),
	projectID: z.string().cuid().min(1, "A project is required to create an order."),
	userID: z.string().min(1, "A user is required to create an order.")
});

export const ecoOrderStatus = z.object({
	orderStatus: z.enum([
		"FUNDS_RECIEVED",
		"REQUEST_TO_RETIRE",
		"CREDITS_RETIRED",
		"NFT_BEING_MINTED",
		"NFT_IN_YOUR_WALLET",
		"ORDER_COMPLETE"
	])
});

export const updateEcoOrderSchema = z
	.object({
		ecoOrderID: z.string().cuid(),
		retireHash: z.string().optional(),
		retireFee: z.number().optional()
	})
	.merge(ecoOrderStatus.partial())
	.catchall(z.literal(""));
