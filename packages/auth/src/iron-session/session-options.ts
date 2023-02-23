import { IronSessionOptions } from "iron-session";

export const ironOptions: IronSessionOptions = {
	cookieName: "ecotoken-session",
	password: process.env.IRON_SESSION_PASSWORD as string,
	cookieOptions: {
		// If you want cookies to expire when the user closes the browser, pass
		// maxAge: undefined in cookie options, this way:
		maxAge: undefined,
		secure: process.env.NODE_ENV === "production"
	}
};

export const adminIronOptions: IronSessionOptions = {
	cookieName: "admin-session",
	password: process.env.IRON_SESSION_PASSWORD as string,
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * Number(process.env.IRON_SESSION_COOKIE_EXPIRE_TIME)
	}
};

export const getOptionsBySite = (url: string) => {
	switch (url) {
		case "localhost:3000": {
			return ironOptions;
		}
		case "localhost:3001": {
			return adminIronOptions;
		}
		default: {
			return ironOptions;
		}
	}
};
