import { S3, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
	forcePathStyle: false, // Configures to use subdomain/virtual calling format.
	endpoint: "https://nyc3.digitaloceanspaces.com",
	region: "us-east-1",
	credentials: {
		accessKeyId: `${process.env.SPACES_KEY}`,
		secretAccessKey: `${process.env.SPACES_SECRET}`
	}
});
