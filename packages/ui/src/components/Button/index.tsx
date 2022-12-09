import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

import Spinner from "../Spinner";

const buttonStyles = cva(
	[
		"flex gap-2 items-center justify-center rounded-md px-2 py-2 disabled:cursor-not-allowed"
	],
	{
		variants: {
			intent: {
				primary: "bg-ecogreen-500 disabled:bg-ecogreen-500/60",
				secondary: "bg-slate-300 disabled:bg-slate-500/80",
				none: ""
			},
			fullWidth: {
				true: "w-full"
			},
			animation: {
				true: "enabled:active:scale-95 scale-100 duration-100"
			}
		},
		defaultVariants: {
			intent: "primary",
			fullWidth: false,
			animation: true
		}
	}
);

export type ButtonProps = VariantProps<typeof buttonStyles> &
	React.ComponentProps<"button"> & { loading?: boolean };
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			intent,
			fullWidth,
			className,
			loading,
			animation,
			children,
			...props
		},
		ref
	) => (
		<button
			ref={ref}
			className={buttonStyles({
				intent,
				fullWidth,
				animation,
				class: className
			})}
			{...props}
			disabled={loading}
		>
			{loading && <Spinner />}
			{children}
		</button>
	)
);
export default Button;
