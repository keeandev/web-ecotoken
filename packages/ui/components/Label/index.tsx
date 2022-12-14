import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const labelStyles = cva([""], {
	variants: {
		size: {
			small: "text-sm",
			medium: "text-md",
			large: "text-lg",
			default: "text-base"
		},
		intent: {
			primary: "text-black",
			error: "text-rose-500"
		}
	},
	defaultVariants: {
		intent: "primary",
		size: "small"
	}
});

type InputProps = VariantProps<typeof labelStyles> &
	React.ComponentProps<"label">;
const Input: React.FC<InputProps> = ({ intent, className, ...props }) => {
	return (
		<label
			className={labelStyles({
				intent,
				class: className
			})}
			{...props}
		/>
	);
};

export default Input;