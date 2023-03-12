import OfficialDecimal from "decimal.js";
import { ZodIssueCode, z } from "zod";

export const decimal = (
    precision: number,
    decimals: OfficialDecimal.Rounding,
) => {
    const Decimal = OfficialDecimal.clone({ precision, rounding: decimals });
    return z
        .instanceof(Decimal)
        .or(z.string())
        .or(z.number())
        .refine((value) => {
            try {
                return new Decimal(value);
            } catch (error) {
                return false;
            }
        })
        .transform((value) => new Decimal(value));
};

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    const field = issue.path[issue.path.length - 1]?.toString() ?? "";
    const capitialField = field?.charAt(0).toUpperCase() + field?.slice(1);
    switch (issue.code) {
        case ZodIssueCode.too_small: {
            return {
                message: `${capitialField} must be at least ${issue.minimum} characters.`,
            };
        }
        default: {
            return { message: ctx.defaultError };
        }
    }
};

export const useCustomErrorMap = () => z.setErrorMap(customErrorMap);
