import { authedProcedure, router } from "../trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "../utils/s3";
import { z } from "zod";

const requiredInput = z.object({
	key: z.string(),
	contentType: z.string(),
	expiresIn: z
		.number()
		.min(5)
		.max(3600)
		.default(2.5 * 60), // 5 minutes
        acl: z.union([z.literal("private"), z.literal("public-read")]).optional()
});

const createPutBucketCommand = (Key: string, ContentType: string, ACL?: string) =>
	new PutObjectCommand({
		Bucket: process.env.SPACES_BUCKET as string,
		Key,
		ContentType,
		ACL
	});

export const uploadRouter = router({
	createPresignedUrl: authedProcedure
		.input(z.union([requiredInput, requiredInput.array().max(20)]))
		.mutation(async ({ ctx, input }) => {
			console.log(input);
			if (!Array.isArray(input)) {
				// change type of input to a single object as it is not an array
				const url = await getSignedUrl(
					// @ts-ignore
					s3Client,
					createPutBucketCommand(input.key, input.contentType, input.acl),
					{
						expiresIn: input.expiresIn
					}
				);
				return url;
			} else {
				const promises = input.map((singleInput) => {
					return getSignedUrl(
						// @ts-ignore
						s3Client,
						createPutBucketCommand(
							singleInput.key,
							singleInput.contentType,
                            singleInput.acl
						),
						{
							expiresIn: singleInput.expiresIn
						}
					);
				});
				return await Promise.all(promises);
			}
			// @ts-ignore
		})
});
