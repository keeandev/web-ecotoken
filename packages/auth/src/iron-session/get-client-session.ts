import { getIronSession } from "iron-session";
// imported getIronSession from client package
import { adminIronOptions, ironOptions } from "./session-options";
import { IncomingMessage, ServerResponse } from "http";
import type { AdminSession, UserSession } from "../..";

export const getClientSession = async (
	req: IncomingMessage | Request,
	res: ServerResponse | Response
) => await getIronSession(req, res, ironOptions) as UserSession;

export const getAdminClientSession = async (
	req: IncomingMessage | Request,
	res: ServerResponse | Response
) => await getIronSession(req, res, adminIronOptions) as AdminSession;
