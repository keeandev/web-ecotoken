import { router, adminAuthedProcedure } from "../../trpc";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "../../utils/s3";
import { createNFTSchema } from "../../schema/nft-builder";

export const nftBuilderRouter = router({
	mint: adminAuthedProcedure
		.input(createNFTSchema)
		.mutation(async ({ ctx, input }) => {
			// WIP
			const imageBuffer = Buffer.from(
				input.image.replace(/^data:image\/\w+;base64,/, ""),
				"base64"
			);
			await client.send(
				new PutObjectCommand({
					Bucket: process.env.SPACES_BUCKET as string,
					Key: "123.png",
					ContentType: "image/png",
					ContentEncoding: "base64",
					Body: imageBuffer
				})
			);
            // next up, create the metadata and mint the nft, problem is we need to add wallet support and mint somehow :)
		})
});
