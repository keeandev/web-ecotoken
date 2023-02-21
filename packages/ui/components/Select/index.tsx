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
				"2xl": "w-96",
				full: "w-full",
				default: ""
			},
			intent: {
				primary: "bg-slate-200 border border-slate-600 ring-slate-400"
			}
		},
		defaultVariants: {
			intent: "primary",
			size: "default"
		}
	}
);

export type Props = Omit<ComponentProps<"select">, "size"> &
	VariantProps<typeof styles>;
const Select = forwardRef<HTMLSelectElement, Props>(
	({ intent, size, className, ...props }, ref) => (
		<select
			{...props}
			className={styles({
				intent,
				size,
				class: className
			})}
			ref={ref}
		/>
	)
);

export default Select;
