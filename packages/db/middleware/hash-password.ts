import { Prisma, PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const hashPasswordMiddleware = (
	prisma: PrismaClient,
	model: Prisma.ModelName
) => {
	prisma.$use(async (params, next) => {
		if (params.model === model) {
			if (params.action === "create" || params.action === "update") {
				const password = params.args.data["password"] as
					| string
					| undefined;
				// hash password if the password that is attempting to be inserted isn't already hashed
				if (password?.startsWith("$argon"))
					params.args.data["password"] = await hash(password);
			}
		}
		return await next(params);
	});
};

export default hashPasswordMiddleware;
