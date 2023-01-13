import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { sealData, unsealData } from "iron-session";
import { TRPCError } from "@trpc/server";
// import * as jose from "jose";
import { verify } from "argon2";
import { createUserSchema } from "../../schema/user";
import { transporter } from "@ecotoken/email";
// probably change later
import { getBaseUrl } from "@ecotoken/user/src/utils/trpc";
import { base64url } from "jose";
import { renderEmailVerificationTemplate } from "@ecotoken/email/src/templates";

export const userAuthRouter = router({
	emailVerification: publicProcedure
		.input(
			z.object({
				token: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const unsealedData = await unsealData<
				z.infer<typeof createUserSchema>
			>(base64url.decode(input.token).toString(), {
				password: process.env.IRON_SESSION_PASSWORD as string,
				ttl:
					60 * 60 * Number(process.env.EMAIL_VERIFICATION_EXPIRE_TIME)
			});

			if (
				!unsealedData.emailAddress ||
				!unsealedData.username ||
				!unsealedData.password ||
				(unsealedData.username &&
					!(
						await ctx.prisma.user.findUnique({
							where: {
								username: unsealedData.username ?? ""
							}
						})
					)?.id)
			)
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Email verification token is invalid."
				});

			await ctx.prisma.user.create({
				data: {
					...unsealedData,
					site: {
						connect: {
							siteID: ctx.currentSite.siteID
						}
					}
				}
			});

			return 200;
		}),
	login: publicProcedure
		.input(
			z.object({
				user: z.union([z.string(), z.string().email()]),
				password: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findFirst({
				where: {
					OR: [
						{
							username: input.user
						},
						{
							emailAddress: input.user
						}
					]
				}
			});

			if (!user || !(await verify(user.password, input.password)))
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Username, email, or password is incorrect."
				});
		}),
	register: publicProcedure
		.input(createUserSchema)
		.mutation(async ({ ctx, input }) => {
			const sealedData = await sealData(
				{ ...input },
				{
					password: process.env.IRON_SESSION_PASSWORD as string,
					ttl:
						60 *
						60 *
						Number(process.env.EMAIL_VERIFICATION_EXPIRE_TIME)
				}
			);

			await transporter.verify();
			await transporter.sendMail({
				from: process.env.EMAIL_VERIFICATION_EMAIL_ADDRESS,
				to: input.emailAddress,
				subject: "ecoToken - Verify your email",
				// text: `Click on this link to verify your email address: ${getBaseUrl()}/email-verification/${base64url.encode(
				// 	sealedData
				// )}`
				html: await renderEmailVerificationTemplate({
					link: `${getBaseUrl()}/email-verification/${base64url.encode(
						sealedData
					)}`
				})
			});
		})
});

// type TypedSocialPayload = {
// 	email: string;
// 	name: string;
// 	profileImage?: string;
// 	verifier: string;
// 	verifierId: string;
// 	aggregateVerifier: string;
// 	typeOfLogin: string;
// 	wallets: {
// 		public_key: string;
// 		type: string;
// 		curve: string;
// 	}[];
// } & TypedPayload;

// type TypedWalletPayload = {
// 	wallets: {
// 		address: string;
// 		type: string;
// 	}[];
// } & TypedPayload;

// type TypedPayload = {
// 	iat: number;
// 	exp: number;
// 	aud: string;
// 	iss: string;
// };

// export const userAuthRouter = router({
// 	login: publicProcedure
// 		.input(
// 			z.object({
// 				idToken: z.string(),
// 				publicKey: z.string().nullish(),
// 				publicAddress: z.string(),
// 				type: z.enum(["external", "social"])
// 			})
// 		)
// 		.mutation(async ({ ctx, input }) => {
// 			const jwksUrl =
// 				input.type === "social"
// 					? "https://api.openlogin.com/jwks"
// 					: "https://authjs.web3auth.io/jwks";

// 			// backend for web3auth checking/verify
// 			const jwks = jose.createRemoteJWKSet(new URL(jwksUrl));

// 			const responsePayload = (
// 				await jose.jwtVerify(input.idToken, jwks, {
// 					algorithms: ["ES256"]
// 				})
// 			).payload;

// 			let payload: TypedSocialPayload | TypedWalletPayload;
// 			let verified: boolean;
// 			let walletAddress: string | undefined;

// 			// wallet login
// 			if (input.type === "external") {
// 				payload = {
// 					aud: responsePayload.audience,
// 					iss: responsePayload.issuer,
// 					...responsePayload
// 				} as TypedWalletPayload;

// 				if (payload?.wallets[0]!.address !== input.publicAddress)
// 					return new TRPCError({
// 						code: "UNAUTHORIZED",
// 						message: "Verification failed."
// 					});

// 				verified = true;
// 				walletAddress = input.publicAddress;
// 			} else {
// 				// social login

// 				payload = {
// 					...responsePayload
// 				} as TypedSocialPayload;

// 				if (payload?.wallets[0]!.public_key !== input.publicKey)
// 					return new TRPCError({
// 						code: "UNAUTHORIZED",
// 						message: "Verification failed."
// 					});

// 				verified = true;
// 				walletAddress = input.publicKey;
// 			}

// 			if (!!input.publicAddress && verified) {
// 				console.log("login payload", payload);

// 				let user = await ctx.prisma.user.findUnique({
// 					where: {
// 						walletAddress
// 					}
// 				});

// 				if (!user) {
// 					let data: Prisma.UserCreateInput;

// 					data = {
// 						walletAddress,
// 						site: {
// 							connect: {
// 								siteID: ctx.currentSite.siteID
// 							}
// 						}
// 					};

// 					if (input.type === "social") {
// 						payload = payload as TypedSocialPayload;
// 						data = {
// 							...data,
// 							emailAddress: payload.email,
// 							name: payload.name,
// 							profileUrl: payload.profileImage ?? null,
// 							typeOfLogin: payload.typeOfLogin,
// 							verifier: payload.verifier
// 						};
// 					} else {
// 						payload = payload as TypedWalletPayload;

// 						data = {
// 							...data
// 						};
// 					}
// 					user = await ctx.prisma.user.create({
// 						data
// 					});
// 				}

// 				ctx.userSession!.user = {
// 					id: user.id,
// 					ipAddress:
// 						process.env.NODE_ENV === "production"
// 							? ctx.req.connection.remoteAddress ?? ""
// 							: undefined
// 				};
// 				await ctx.userSession?.save();
// 			} else
// 				return new TRPCError({
// 					code: "UNAUTHORIZED",
// 					message: "Verification failed."
// 				});
// 		}),
// 	logout: userAuthedProcedure.query(async ({ ctx }) => {
// 		await ctx.userSession.destroy();
// 		return 200;
// 	})
// });
