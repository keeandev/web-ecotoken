import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const labelStyles = cva([""], {
	variants: {
		size: {
			xs: "text-xs",
			sm: "text-sm",
			md: "text-md",
			lg: "text-lg",
			default: "text-base"
		},
		intent: {
			primary: "text-black"
		}
	},
	defaultVariants: {
		intent: "primary"
	}
});

type InputProps = VariantProps<typeof labelStyles> &
	React.ComponentProps<"label">;
const Label: React.FC<InputProps> = ({ intent, className, ...props }) => {
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

export default Label;
