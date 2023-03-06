import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";

const styles = cva(
    [
        "rounded-md p-1.5 duration-100 ease-in focus:ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200 transition-[box-shadow]",
    ],
    {
        variants: {
            width: {
                md: "w-36",
                lg: "w-64",
                xl: "w-72",
                "2xl": "w-96",
                full: "w-full",
                default: "",
            },
            height: {
                md: "h-36",
                lg: "h-64",
                xl: "h-72",
                "2xl": "h-96",
                full: "h-full",
                default: "",
            },
            intent: {
                primary: "bg-slate-200 border border-slate-600 ring-slate-400",
            },
        },
        defaultVariants: {
            intent: "primary",
            width: "default",
            height: "default",
        },
    },
);

export interface Props extends Omit<ComponentProps<"textarea">, "size">,
    VariantProps<typeof styles> {}
const TextArea = forwardRef<HTMLTextAreaElement, Props>(
    ({ intent, width, height, className, ...props }, ref) => (
        <textarea
            {...props}
            className={styles({
                intent,
                width,
                height,
                class: className,
            })}
            ref={ref}
        />
    ),
);

export default TextArea;
