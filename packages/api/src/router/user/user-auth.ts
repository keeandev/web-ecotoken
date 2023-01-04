import { z } from "zod";
import { userAuthedProcedure, publicProcedure, router } from "../../trpc";
import { TRPCError } from "@trpc/server";
import * as jose from "jose";
import { Prisma } from "@prisma/client";

type TypedSocialPayload = {
	email: string;
	name: string;
	profileImage?: string;
	verifier: string;
	verifierId: string;
	aggregateVerifier: string;
	typeOfLogin: string;
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

export const userAuthRouter = router({
	login: publicProcedure
		.input(
			z.object({
				idToken: z.string(),
				publicKey: z.string().nullish(),
				publicAddress: z.string(),
				type: z.enum(["external", "social"])
			})
		)
		.mutation(async ({ ctx, input }) => {
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
			let verified: boolean;
			let walletAddress: string | undefined;

			// wallet login
			if (input.type === "external") {
				payload = {
					aud: responsePayload.audience,
					iss: responsePayload.issuer,
					...responsePayload
				} as TypedWalletPayload;

				if (payload?.wallets[0]!.address !== input.publicAddress)
					return new TRPCError({
						code: "UNAUTHORIZED",
						message: "Verification failed."
					});

				verified = true;
				walletAddress = input.publicAddress;
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

				verified = true;
				walletAddress = input.publicKey;
			}

			if (!!input.publicAddress && verified) {
				console.log("login payload", payload);

				let user = await ctx.prisma.user.findUnique({
					where: {
						walletAddress
					}
				});

				if (!user) {
					let data: Prisma.UserCreateInput;

					data = {
						walletAddress,
						site: {
							connect: {
								siteID: ctx.currentSite.siteID
							}
						}
					};

					if (input.type === "social") {
						payload = payload as TypedSocialPayload;
						data = {
							...data,
							emailAddress: payload.email,
							name: payload.name,
							profileUrl: payload.profileImage ?? null,
							typeOfLogin: payload.typeOfLogin,
							verifier: payload.verifier
						};
					} else {
						payload = payload as TypedWalletPayload;

						data = {
							...data
						};
					}
					user = await ctx.prisma.user.create({
						data
					});
				}

				ctx.userSession!.user = {
					id: user.id,
					ipAddress:
						process.env.NODE_ENV === "production"
							? ctx.req.connection.remoteAddress ?? ""
							: undefined
				};
				await ctx.userSession?.save();
			} else
				return new TRPCError({
					code: "UNAUTHORIZED",
					message: "Verification failed."
				});
		}),
	logout: userAuthedProcedure.query(async ({ ctx }) => {
		await ctx.userSession.destroy();
		return 200;
	})
});
