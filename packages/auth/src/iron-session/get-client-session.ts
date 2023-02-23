import { getIronSession } from "iron-session";
// imported getIronSession from client package
import { getOptionsBySite, ironOptions } from "./session-options";
import { IncomingMessage, ServerResponse } from "http";
import { AdminSession, UserSession } from "../..";

export const getClientSession = async (
	req: IncomingMessage | Request,
	res: ServerResponse | Response,
    url: string
) => await getIronSession(req, res, getOptionsBySite(url)) as UserSession | AdminSession;