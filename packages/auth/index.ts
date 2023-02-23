export {
	ironOptions,
	adminIronOptions
} from "./src/iron-session/session-options";
export type { IronSessionData } from "iron-session";
import type { IronSession } from "iron-session";
import { Permission } from "@ecotoken/db";

export type UserSession = {
	user?: {
		type: "user";
		id: string;
		permissions?: Permission[];
		ipAddress?: string;
	};
} & IronSession;

export type AdminSession = {
	user?: {
		type: "admin";
		id: string;
		permissions?: Permission[];
		ipAddress?: string;
		selectedSite?: string;
	};
} & IronSession;
