export { ironOptions } from "./src/session-options";
export type { IronSessionData } from "iron-session";
import { IncomingMessage, ServerResponse } from "http";

declare module "iron-session" {
	interface IronSessionData {
		user?: {
			id: string;
			// will use for logging user out on ip change
			ipAddress: string;
		};
	}
}

export const getIronSession = (
	req: IncomingMessage | Request,
	res: ServerResponse | Response,
	edge?: boolean
) => {
	if (!!edge)
		return import("./src/get-edge-session").then((session) =>
			session.getEdgeSession(req, res)
		);
	else
		return import("./src/get-client-session").then((session) =>
			session.getClientSession(req, res)
		);
};
