import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const inputStyles = cva(
	[
		"rounded-md p-1.5 duration-100 ease-in focus:ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200"
	],
	{
		variants: {
			type: {
				text: "",
				number: "",
				password: "",
				checkbox: "",
				submit: "",
				email: "",
				date: "",
				file: "",
				combobox: ""
			},
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
			type: "text",
			size: "default"
		}
	}
);

export type InputProps = VariantProps<typeof inputStyles> &
	Omit<React.ComponentProps<"input">, "size">;
const Input = forwardRef<HTMLInputElement, InputProps>(
	({ id, type, intent, className, size, ...props }, ref) => {
		return (
			<input
				{...props}
				id={id}
				ref={ref}
				type={type}
				className={inputStyles({
					type,
					intent,
					size,
					class: className
				})}
			/>
		);
	}
);

export default Input;
