import { TRPCError } from "@trpc/server";
import * as jose from "jose";
import { z } from "zod";

import { authedProcedure, publicProcedure, router } from "../trpc";

type TypedSocialPayload = {
	email: string;
	name: string;
	profileImage?: string;
	verifier: string;
	verifierId: string;
	aggregateVerifier: string;
	wallets: {
		public_key: string;
		type: string;
		curve: string;
	}[];
} & TypedPayload;

type TypedWalletPayload = {
	wallets: {
		address: string;
		type: string;
	}[];
} & TypedPayload;

type TypedPayload = {
	iat: number;
	exp: number;
	aud: string;
	iss: string;
};

export const authRouter = router({
	login: publicProcedure
		.input(
			z.object({
				idToken: z.string(),
				publicKey: z.string().nullish(),
				publicAddress: z.string().nullish(),
				type: z.string().nullish()
			})
		)
		.query(async ({ ctx, input, ...rest }) => {
			const jwksUrl =
				input.type === "social"
					? "https://api.openlogin.com/jwks"
					: "https://authjs.web3auth.io/jwks";

			// backend for web3auth checking/verify
			const jwks = jose.createRemoteJWKSet(new URL(jwksUrl));

			const responsePayload = (
				await jose.jwtVerify(input.idToken, jwks, {
					algorithms: ["ES256"]
				})
			).payload;

			let payload: TypedSocialPayload | TypedWalletPayload;

			// wallet login
			if ((responsePayload as any).wallets[0].address) {
				payload = {
					aud: responsePayload.audience,
					iss: responsePayload.issuer,
					...responsePayload
				} as TypedWalletPayload;

				if (payload?.wallets[0]!.address !== input.publicKey)
					return new TRPCError({
						code: "UNAUTHORIZED",
						message: "Verification failed."
					});

				let user = await ctx.prisma.user.findUnique({
					where: {
						walletAddress: payload?.wallets[0]!.address
					}
				});

				if (!user) {
					user = await ctx.prisma.user.create({
						data: {
							walletAddress: payload?.wallets[0]!.address
						}
					});
				}

				ctx.session.user = {
					id: user.id,
					ipAddress: ctx.req.connection.remoteAddress ?? ""
				};
				await ctx.session.save();
				return 200;
			} else {
				// social login

				payload = {
					...responsePayload
				} as TypedSocialPayload;

				if (payload?.wallets[0]!.public_key !== input.publicKey)
					return new TRPCError({
						code: "UNAUTHORIZED",
						message: "Verification failed."
					});
				return 200;
			}
		}),
	logout: authedProcedure.query(async ({ ctx }) => {
		await ctx.session.destroy();
		return 200;
	})
});
