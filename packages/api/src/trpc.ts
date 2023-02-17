import { TRPCError, initTRPC } from "@trpc/server";
import { transformer } from "../transformer";
import { hasPermission } from "./utils/permission";

import type { Context } from "./context";
import type { UserSession, AdminSession } from "@ecotoken/auth";

type Meta = {
	requiredPermissions?: string[];
	session?: UserSession | AdminSession;
};

const t = initTRPC
	.context<Context>()
	.meta<Meta>()
	.create({
		transformer,
		errorFormatter({ shape }) {
			return shape;
		}
	});

export const isUserAuthenticated = t.middleware(({ next, ctx, meta }) => {
	if (!ctx.userSession?.user?.id) {
		throw new TRPCError({
			code: "UNAUTHORIZED"
		});
	}
	if (meta) meta.session = ctx.userSession;
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			userSession: ctx.userSession
		}
	});
});

export const isAdminAuthenticated = t.middleware(({ next, ctx, meta }) => {
	if (!ctx.adminSession?.user?.id) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You are not authorized to access this endpoint."
		});
	}
	if (meta) meta.session = ctx.adminSession;
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			adminSession: ctx.adminSession
		}
	});
});

export const isUserOrOrAdminAuthenticated = t.middleware(({ next, ctx, meta }) => {
	if (!ctx.adminSession?.user?.id && !ctx.userSession.user?.id) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You are not authorized to access this endpoint."
		});
	}
	if (meta) {
		if (ctx.adminSession.user?.id) meta.session = ctx.adminSession;
		else meta.session = ctx.userSession;
	}
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			adminSession: ctx.adminSession
		}
	});
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

export const hasRequiredPermissions = t.middleware(async ({ meta, next }) => {
	if (
		!hasPermission(
			meta?.session?.user?.permissions ?? [],
			meta?.requiredPermissions ?? ""
		)
	)
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Not enough permissions."
		});
	return next();
});

export const router = t.router;

export const publicProcedure = t.procedure.use(isOnWhitelistedSite);
export const authedProcedure = publicProcedure
	.use(isUserOrOrAdminAuthenticated)
	.use(hasRequiredPermissions);
export const userAuthedProcedure = publicProcedure
	.use(isUserAuthenticated)
	.use(hasRequiredPermissions);
export const adminAuthedProcedure = publicProcedure
	.use(isAdminAuthenticated)
	.use(hasRequiredPermissions);
