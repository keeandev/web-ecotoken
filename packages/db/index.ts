import { PrismaClient } from "@prisma/client";
import hashPasswordMiddleware from "./middleware/hash-password";

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"]
	});

export * from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
}

// Exclude keys from user
export function exclude<T, Key extends keyof T>(
	user: T,
	keys: Key[]
): Omit<T, Key> {
	for (const key of keys) {
		delete user[key];
	}
	return user;
}

hashPasswordMiddleware(prisma, "AdminUser");
