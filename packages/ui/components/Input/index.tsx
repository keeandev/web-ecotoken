import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import BaseLabel from "../Label";

const inputStyles = cva(
	[
		"rounded-md p-1.5 duration-100 ease-in focus:ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200"
	],
	{
		variants: {
			type: {
				text: "",
				password: "",
				checkbox: ""
			},
			size: {
				md: "w-36",
				lg: "w-64",
				xl: "w-72",
				"2xl": "w-96",
				default: "w-fit"
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
			type: "text",
			size: "default"
		}
	}
);

type InputProps = VariantProps<typeof inputStyles> &
	Omit<React.ComponentProps<"input">, "size"> & {
		label?: string;
		error?: string;
	};
const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{ type, intent, fullWidth, className, label, size, error, ...props },
		ref
	) => {
		if (label || error) {
			return (
				<div className="space-y-0.5">
					{label && (
						<BaseLabel htmlFor={props.name} className="block">
							{label}
						</BaseLabel>
					)}
					<input
						ref={ref}
						type={type}
						className={inputStyles({
							type,
							intent,
							fullWidth,
							size,
							class: className
						})}
						{...props}
					/>
					{error && (
						<BaseLabel
							htmlFor={props.name}
							intent="error"
							className="block"
						>
							{error}
						</BaseLabel>
					)}
				</div>
			);
		} else {
			return (
				<input
					type={type}
					className={inputStyles({
						type,
						intent,
						fullWidth,
						class: className
					})}
					{...props}
				/>
			);
		}
	}
);

export default Input;
