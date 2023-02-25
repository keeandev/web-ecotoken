import { TRPCError, initTRPC } from "@trpc/server";
import { transformer } from "../transformer";
import { hasPermission } from "./utils/permission";

import type { Context } from "./context";
import type { UserSession, AdminSession } from "@ecotoken/auth";

type Meta = {
	requiredPermissions?: string[];
};

export type DeepRequired<T> = {
	[K in keyof T]: DeepRequired<T[K]>;
} & Required<T>;

const t = initTRPC
	.context<Context>()
	.meta<Meta>()
	.create({
		transformer,
		errorFormatter({ shape }) {
			return shape;
		}
	});

export const isOnWhitelistedSite = t.middleware(({ next, ctx }) => {
	if (!ctx.currentSite?.siteID) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You are not authorized to access this endpoint."
		});
	}
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			currentSite: ctx.currentSite
		}
	});
});

export const isAuthenticated = isOnWhitelistedSite.unstable_pipe(
	({ next, ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({
				code: "UNAUTHORIZED"
			});
		}
		const session = ctx.session as DeepRequired<typeof ctx.session>;
		return next({
			ctx: {
				// Infers the `session` as non-nullable
				session
			}
		});
	}
);

export const isUserAuthenticated = isAuthenticated.unstable_pipe(
	({ next, ctx }) => {
		if (ctx.session.user.type !== "user") {
			throw new TRPCError({
				code: "UNAUTHORIZED"
			});
		}
		const session = ctx.session as DeepRequired<UserSession>;
		return next({
			ctx: {
				// Infers the `session` as non-nullable
				session
			}
		});
	}
);

export const isAdminAuthenticated = isAuthenticated.unstable_pipe(
	({ next, ctx }) => {
		if (ctx.session.user.type !== "admin") {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You are not authorized to access this endpoint."
			});
		}
		const session = ctx.session as DeepRequired<AdminSession>;
		return next({
			ctx: {
				// Infers the `session` as non-nullable
				session
			}
		});
	}
);

export const hasRequiredPermissions = isAuthenticated.unstable_pipe(
	async ({ ctx, meta, next }) => {
		if (
			!hasPermission(
				ctx.session.user.permissions ?? [],
				meta?.requiredPermissions ?? ""
			)
		)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Not enough permissions."
			});
		return next({ ctx });
	}
);

export const router = t.router;

export const publicProcedure = t.procedure.use(isOnWhitelistedSite);
export const authedProcedure = publicProcedure.use(isAuthenticated);
export const userAuthedProcedure = publicProcedure.use(isUserAuthenticated);
export const adminAuthedProcedure = publicProcedure.use(isAdminAuthenticated);
