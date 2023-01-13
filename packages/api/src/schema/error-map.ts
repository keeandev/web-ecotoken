import { z, ZodIssueCode } from "zod";

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
	const field = issue.path[issue.path.length - 1]?.toString() ?? "";
	const capitialField = field?.charAt(0).toUpperCase() + field?.slice(1);
	switch (issue.code) {
		case ZodIssueCode.too_small: {
			return {
				message: `${capitialField} must be at least ${issue.minimum} characters.`
			};
		}
		default: {
			return { message: ctx.defaultError };
		}
	}
};

export const useCustomErrorMap = () => z.setErrorMap(customErrorMap);
