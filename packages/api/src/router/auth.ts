import { z } from "zod";
import { authedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { verify } from "argon2";
import * as jose from "jose";
import bs58 from "bs58";

export const adminAuthRouter = router({
	login: publicProcedure
		.input(
			z.object({
				username: z.string(),
				password: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.prisma.adminUser.findFirst({
				where: {
					username: input.username
				}
			});

			if (!user || !(await verify(user.password, input.password)))
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Username or password is incorrect."
				});

			ctx.session.user = {
				id: user.adminID,
				ipAddress: ctx.req.connection.remoteAddress ?? ""
			};
			await ctx.session.save();

			const currentDate = new Date();
			const expireDate = new Date(
				currentDate.setDate(currentDate.getDate() + 180)
			);

			await ctx.prisma.adminUser.update({
				where: {
					username: input.username
				},
				data: {
					hits: user.hits + 1,
					lastLogin: currentDate,
					expireAt: expireDate
				}
			});
		}),
	logout: publicProcedure.query(({ ctx }) => {
		ctx.session.destroy();
		return 200;
	})
});

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

export const walletAuthRouter = router({
	login: publicProcedure
		.input(
			z.object({
				idToken: z.string(),
				publicKey: z.string().nullish(),
				publicAddress: z.string().nullish(),
				type: z.string().nullish()
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
			let address: string;

			// wallet login
			if ((responsePayload as any).wallets[0].address) {
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

				address = bs58.encode(Buffer.from(input.publicAddress ?? ""));
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

				address = bs58.encode(Buffer.from(input.publicKey ?? ""));
				return 200;
			}

			if (address) {
				let user = await ctx.prisma.user.findUnique({
					where: {
						walletAddress: `${input.publicKey}`
					}
				});

				if (!user) {
					user = await ctx.prisma.user.create({
						data: {
							walletAddress: `${input.publicKey}`
						}
					});
				}

				ctx.session.user = {
					id: user.id,
					ipAddress: ctx.req.connection.remoteAddress ?? ""
				};
				await ctx.session.save();
				return 200;
			} else
				return new TRPCError({
					code: "UNAUTHORIZED",
					message: "Verification failed."
				});
		}),
	logout: authedProcedure.query(async ({ ctx }) => {
		await ctx.session.destroy();
		return 200;
	})
});
