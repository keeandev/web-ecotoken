import { z } from "zod";
import { publicProcedure, router, userAuthedProcedure } from "../../trpc";
import { sealData, unsealData } from "iron-session";
import { TRPCError } from "@trpc/server";
// import * as jose from "jose";
import { verify } from "argon2";
import { createUserSchema, loginUserSchema } from "../../schema/user";
import { transporter } from "@ecotoken/email";
// probably change later
import { getBaseUrl } from "@ecotoken/user/src/utils/trpc";
import { usersRouter } from "./users";

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
			>(atob(input.token), {
				password: process.env.IRON_SESSION_PASSWORD as string,
				ttl:
					60 * 60 * Number(process.env.EMAIL_VERIFICATION_EXPIRE_TIME)
			});

			if (
				!unsealedData.email ||
				!unsealedData.username ||
				!unsealedData.password ||
				!unsealedData.firstName ||
				!unsealedData.lastName
			)
				throw new TRPCError({
					code: "UNAUTHORIZED",
					cause: "invalid",
					message: "Email verification token is invalid."
				});

			// check if user has already been created and their email already exists in the database
			if (
				await ctx.prisma.user.findUnique({
					where: {
						email: unsealedData.email
					}
				})
			)
				throw new TRPCError({
					code: "UNAUTHORIZED",
					cause: "expired",
					message: "Email verification token has expired."
				});

			const usersRouterInterface = usersRouter.createCaller(ctx);
			await usersRouterInterface.create({
				...unsealedData
			});

			return 200;
		}),
	login: publicProcedure
		.input(loginUserSchema)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findFirst({
				where: {
					OR: [
						{
							username: input.user
						},
						{
							email: input.user
						}
					],
					AND: {
						site: {
							siteID: ctx.currentSite.siteID
						}
					}
				}
			});

			if (!user || !(await verify(user.password, input.password)))
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Username, email, or password is incorrect."
				});
			const role = await ctx.prisma.role.findFirst({
				where: {
					OR: [
						{
							sites: {
								some: {
									siteID: ctx.selectedSite?.siteID
								}
							},
							scope: "SITE"
						},
						{
							domain: {
								equals: "ADMIN"
							},
							scope: "DEFAULT"
						}
					]
				},
				include: {
					permissions: true
				}
			});
			ctx.session!.user = {
				type: "user",
				id: user.userID,
				permissions: role?.permissions,
				ipAddress:
					process.env.NODE_ENV === "production"
						? ctx.req.connection.remoteAddress ?? ""
						: undefined
			};
			await ctx.session!.save();
		}),
	register: publicProcedure
		.input(createUserSchema)
		.mutation(async ({ input, ctx }) => {
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

			if (!!process.env.DISABLE_EMAIL_VERIFICATION) {
				const usersRouterInterface = usersRouter.createCaller(ctx);
				await usersRouterInterface.create({
					...input
				});
			} else {
				await transporter.verify();
				await transporter.sendMail({
					from: process.env.EMAIL_VERIFICATION_EMAIL_ADDRESS,
					to: input.email,
					subject: "ecoToken - Verify your email",
					html: `
                <h1 style="margin-bottom: 8px;">Verify your email address</h1>
                <h3 style="margin-bottom: 16px;">
                    To continue setting up your ecoToken account, please verify your
                    email address.
                </h3>
                <a href="${getBaseUrl()}/email-verification/${btoa(
						sealedData
					)}">Verify email address</a>
                `
				});
			}
		}),
	logout: userAuthedProcedure.query(async ({ ctx }) => {
		await ctx.session.destroy();
		return 200;
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
