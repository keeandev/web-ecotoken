import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import BaseLabel from "../Label";

const inputStyles = cva(
	[
		"rounded-md p-1.5 duration-100 ease-in focus:ease-out focus:outline-none focus:ring-2"
	],
	{
		variants: {
			type: {
				text: "",
				password: "",
				checkbox: ""
			},
			intent: {
				primary: "",
				secondary: "ring-slate-400 bg-slate-300"
			},
			fullWidth: {
				true: "w-full",
				false: "w-fit"
			}
		},
		defaultVariants: {
			intent: "primary",
			fullWidth: false,
			type: "text"
		}
	}
);

type InputProps = VariantProps<typeof inputStyles> &
	React.ComponentProps<"input"> & {
		label?: string;
		error?: string;
	};
const Input = forwardRef<HTMLInputElement, InputProps>(
	({ type, intent, fullWidth, className, label, error, ...props }, ref) => {
		if (label || error) {
			return (
				<div>
					{label && (
						<BaseLabel htmlFor={props.name}>{label}</BaseLabel>
					)}
					<input
						ref={ref}
						type={type}
						className={inputStyles({
							type,
							intent,
							fullWidth,
							class: className
						})}
						{...props}
					/>
					{error && (
						<BaseLabel htmlFor={props.name} intent="error">
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
