import { TRPCError, initTRPC } from "@trpc/server";
import { transformer } from "../transformer";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
	transformer,
	errorFormatter({ shape }) {
		return shape;
	}
});

export const isAuthenticated = t.middleware(({ next, ctx }) => {
	if (!ctx.session?.user?.id) {
		throw new TRPCError({
			code: "UNAUTHORIZED"
		});
	}
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			session: ctx.session
		}
	});
});

export const router = t.router;

export const publicProcedure = t.procedure;
export const authedProcedure = publicProcedure.use(isAuthenticated);
