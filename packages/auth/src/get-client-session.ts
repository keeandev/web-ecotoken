import { getIronSession } from "iron-session";
// imported getIronSession from client package
import { ironOptions } from "./session-options";
import { IncomingMessage, ServerResponse } from "http";

export const getClientSession = async (
	req: IncomingMessage | Request,
	res: ServerResponse | Response
) => await getIronSession(req, res, ironOptions);
