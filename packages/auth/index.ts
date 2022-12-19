export { ironOptions, adminIronOptions } from "./src/iron-session/session-options";
export type { IronSessionData } from "iron-session";
import { IncomingMessage, ServerResponse } from "http";
import type { IronSession } from "iron-session";

export type UserSession = {
    user?: {
        id: string,
        ipAddress: string
    }
} & IronSession

export type AdminSession = {
	user?: {
		id: string;
		ipAddress: string;
	};
} & IronSession;


export const getUserSession = (
	req: IncomingMessage | Request,
	res: ServerResponse | Response,
	edge?: boolean,
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
