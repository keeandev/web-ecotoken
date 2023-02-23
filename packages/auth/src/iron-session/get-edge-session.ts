import { getIronSession } from "iron-session/edge";
// imported getIronSession from edge package
import { getOptionsBySite } from "./session-options";
import { IncomingMessage, ServerResponse } from "http";
import type { AdminSession, UserSession } from "../..";

export const getEdgeSession = async (
	req: IncomingMessage | Request,
	res: ServerResponse | Response,
    url: string
) => await getIronSession(req, res, getOptionsBySite(url)) as UserSession | AdminSession;