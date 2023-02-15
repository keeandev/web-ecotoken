import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";

const styles = cva(
	[
		"rounded-md p-1.5 duration-100 ease-in focus:ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200"
	],
	{
		variants: {
			size: {
				md: "w-36",
				lg: "w-64",
				xl: "w-72",
				"2xl": "w-96"
			},
			intent: {
				primary: "bg-slate-200 border border-slate-600 ring-slate-400"
			},
			fullWidth: {
				true: "w-full",
				false: "w-fit"
			}
		},
		defaultVariants: {
			intent: "primary",
			fullWidth: false,
			size: "xl"
		}
	}
);

export type Props = ComponentProps<"select"> & VariantProps<typeof styles>;
const Select = forwardRef<HTMLSelectElement, Props>(({ intent, fullWidth, size, className, ...props}, ref) => (
	<select
		{...props}
		className={styles({
			intent,
			fullWidth,
			size,
			class: className
		})}
		ref={ref}
	/>
));

export default Select;
