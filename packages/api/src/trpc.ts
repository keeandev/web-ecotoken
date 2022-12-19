import { TRPCError, initTRPC } from "@trpc/server";
import { transformer } from "../transformer";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
	transformer,
	errorFormatter({ shape }) {
		return shape;
	}
});

export const isUserAuthenticated = t.middleware(({ next, ctx }) => {
	if (!ctx.userSession?.user?.id) {
		throw new TRPCError({
			code: "UNAUTHORIZED"
		});
	}
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			userSession: ctx.userSession
		}
	});
});

export const isAdminAuthenticated = t.middleware(({ next, ctx }) => {
	if (!ctx.adminSession?.user?.id) {
		throw new TRPCError({
			code: "UNAUTHORIZED"
		});
	}
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			adminSession: ctx.adminSession
		}
	});
});

export const router = t.router;

export const publicProcedure = t.procedure;
export const userAuthedProcedure = publicProcedure.use(isUserAuthenticated);
export const adminAuthedProcedure = publicProcedure.use(isAdminAuthenticated);
