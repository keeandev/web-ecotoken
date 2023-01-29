import { mintNFTSchema } from "../../schema/nft-builder";
import { router, adminAuthedProcedure } from "../../trpc";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "../../utils/s3";

export const nftBuilderRouter = router({
	mint: adminAuthedProcedure
		.input(mintNFTSchema)
		.mutation(async ({ ctx, input }) => {
            // WIP
			const url = await client.send(
				new PutObjectCommand({
					Bucket: process.env.SPACES_BUCKET as string,
					Key: "123.png",
					ContentType: "file",
					Body: input.image
				})
			);
			console.log("url", url);
		})
});
