import { getIronSession } from "iron-session/edge";
// imported getIronSession from edge package
import { adminIronOptions, ironOptions } from "./session-options";
import { IncomingMessage, ServerResponse } from "http";
import type { AdminSession, UserSession } from "../..";

export const getEdgeSession = async (
	req: IncomingMessage | Request,
	res: ServerResponse | Response
) => await getIronSession(req, res, ironOptions) as UserSession;

export const getAdminEdgeSession = async (
	req: IncomingMessage | Request,
	res: ServerResponse | Response
) => await getIronSession(req, res, adminIronOptions) as AdminSession;