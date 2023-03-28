/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { type NextApiRequest, type NextApiResponse } from "next";
import { TRPCError, initTRPC } from "@trpc/server";
import  { type AdminSession, type UserSession } from "@ecotoken/auth";
import { exclude } from "@ecotoken/db";

import { transformer } from "../transformer";
import  { type Context } from "./context";
import { hasPermission } from "./utils/permission";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
type CreateNextContextOptions = {
    session?: AdminSession | UserSession;
    currentSite?: Site;
    selectedSite?: Site;
    req: NextApiRequest;
    res: NextApiResponse;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createInnerTRPCContext = (opts: CreateNextContextOptions) => {
    return {
        prisma,
        ...opts,
    };
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async ({
    req,
    res,
}: CreateNextContextOptions) => {
    // fetch the session, decrypt cookie/deserialize -> get session as `userSession` or `adminSession`
    const url = stripUrl(req.headers.referer);
    const session = await getClientSession(req, res, url ?? "");

    const currentSite = await prisma.site.findFirst({
        where: {
            OR: [
                {
                    devUrl: {
                        equals: url,
                    },
                },
                {
                    stageUrl: {
                        equals: url,
                    },
                },
                {
                    prodUrl: {
                        equals: url,
                    },
                },
            ],
        },
    });

    let selectedSite;
    if (session && session.user?.type === "admin") {
        selectedSite = await prisma.site.findUnique({
            where: {
                siteID: session.user?.selectedSite ?? "",
            },
        });
    }

    return createInnerTRPCContext({
        session,
        currentSite: currentSite ?? undefined,
        selectedSite: selectedSite ?? undefined,
        req,
        res,
    });
};

type Meta = {
    requiredPermissions?: string[];
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC
    .context<typeof createTRPCContext>()
    .meta<Meta>()
    .create({
        transformer,
        errorFormatter({ shape, error }) {
            return {
                ...shape,
                data: {
                    ...shape.data,
                    zodError:
                        error.cause instanceof ZodError
                            ? error.cause.flatten()
                            : null,
                },
            };
        },
    });

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

export type DeepRequired<T> = {
    [K in keyof T]: DeepRequired<T[K]>;
} & Required<T>;

export const isOnWhitelistedSite = t.middleware(({ next, ctx }) => {
    if (!ctx.currentSite?.siteID) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to access this endpoint.",
        });
    }
    return next({
        ctx: {
            // Infers the `session` as non-nullable
            currentSite: ctx.currentSite,
        },
    });
});

export const isAuthenticated = isOnWhitelistedSite.unstable_pipe(
    ({ next, ctx }) => {
        if (!ctx.session?.user?.id) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
            });
        }
        const session = ctx.session as DeepRequired<typeof ctx.session>;
        return next({
            ctx: {
                // Infers the `session` as non-nullable
                session,
            },
        });
    },
);

export const isUserAuthenticated = isAuthenticated.unstable_pipe(
    ({ next, ctx }) => {
        if (ctx.session.user.type !== "user") {
            throw new TRPCError({
                code: "UNAUTHORIZED",
            });
        }
        const session = ctx.session as DeepRequired<UserSession>;
        return next({
            ctx: {
                // Infers the `session` as non-nullable and excludes the session type when we know for a fact that the user is not an admin
                ...session,
                user: exclude(session.user, ["type"]),
            },
        });
    },
);

export const isAdminAuthenticated = isAuthenticated.unstable_pipe(
    ({ next, ctx }) => {
        if (ctx.session.user.type !== "admin") {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You are not authorized to access this endpoint.",
            });
        }
        const session = ctx.session as DeepRequired<AdminSession>;
        return next({
            ctx: {
                // Infers the `session` as non-nullable and excludes the session type when we know for a fact that the user is an admin
                session: {
                    ...session,
                    user: exclude(session.user, ["type"]),
                },
            },
        });
    },
);

export const hasRequiredPermissions = isAuthenticated.unstable_pipe(
    async ({ ctx, meta, next }) => {
        if (
            !hasPermission(
                ctx.session.user.permissions ?? [],
                meta?.requiredPermissions ?? "",
            )
        )
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Not enough permissions.",
            });
        return next({ ctx });
    },
);

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(isOnWhitelistedSite);

export const authedProcedure = publicProcedure.use(isAuthenticated);
export const userAuthedProcedure = publicProcedure.use(isUserAuthenticated);
export const adminAuthedProcedure = publicProcedure.use(isAdminAuthenticated);
