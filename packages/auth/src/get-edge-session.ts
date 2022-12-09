import { getIronSession } from "iron-session/edge";
// imported getIronSession from edge package
import { ironOptions } from "./session-options";
import { IncomingMessage, ServerResponse } from "http";

export const getEdgeSession = async (
	req: IncomingMessage | Request,
	res: ServerResponse | Response
) => await getIronSession(req, res, ironOptions);
