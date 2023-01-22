export {
	ironOptions,
	adminIronOptions
} from "./src/iron-session/session-options";
export type { IronSessionData } from "iron-session";
import { IncomingMessage, ServerResponse } from "http";
import type { IronSession } from "iron-session";
import { Permission } from "@ecotoken/db";

export type UserSession = {
	user?: {
		id: string;
		permissions?: Permission[];
		ipAddress?: string;
	};
} & IronSession;

export type AdminSession = {
	user?: {
		id: string;
		permissions?: Permission[];
		ipAddress?: string;
		lastSite?: string;
	};
} & IronSession;

export const getUserSession = (
	req: IncomingMessage | Request,
	res: ServerResponse | Response,
	edge?: boolean
) => {
	if (!!edge)
		return import("./src/iron-session/get-edge-session").then((session) =>
			session.getEdgeSession(req, res)
		);
	else
		return import("./src/iron-session/get-client-session").then((session) =>
			session.getClientSession(req, res)
		);
};

export const getAdminSession = (
	req: IncomingMessage | Request,
	res: ServerResponse | Response,
	edge?: boolean
) => {
	if (!!edge)
		return import("./src/iron-session/get-edge-session").then((session) =>
			session.getAdminEdgeSession(req, res)
		);
	else
		return import("./src/iron-session/get-client-session").then((session) =>
			session.getAdminClientSession(req, res)
		);
};
