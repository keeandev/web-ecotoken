import { getClientSession } from "@ecotoken/auth/src/iron-session/get-client-session";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type UserSession, type AdminSession } from "@ecotoken/auth";
import { stripUrl } from "@ecotoken/auth/src/utils/strip-url";
import type { NextApiRequest, NextApiResponse } from "next";
import { type inferAsyncReturnType } from "@trpc/server";
import { prisma, Site } from "@ecotoken/db";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
	session?: AdminSession | UserSession;
	currentSite?: Site;
	selectedSite?: Site;
	req: NextApiRequest;
	res: NextApiResponse;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	return {
		prisma,
		...opts
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
	// fetch the session, decrypt cookie/deserialize -> get session as `userSession` or `adminSession`
	const url = stripUrl(req.headers.referer);
	const session = await getClientSession(req, res, url ?? "");

	const currentSite = await prisma.site.findFirst({
		where: {
			OR: [
				{
					devUrl: {
						equals: url
					}
				},
				{
					stageUrl: {
						equals: url
					}
				},
				{
					prodUrl: {
						equals: url
					}
				}
			]
		}
	});

	let selectedSite;
	if (session && session.user?.type === "admin") {
		selectedSite = await prisma.site.findUnique({
			where: {
				siteID: session.user?.selectedSite ?? ""
			}
		});
	}

	return await createContextInner({
		session,
		currentSite: currentSite ?? undefined,
		selectedSite: selectedSite ?? undefined,
		req,
		res
	});
};

export type Context = inferAsyncReturnType<typeof createContext>;
