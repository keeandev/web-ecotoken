import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

import Spinner from "../Spinner";

const buttonStyles = cva(
	[
		"flex gap-2 items-center justify-center rounded-md px-4 py-2 disabled:cursor-not-allowed"
	],
	{
		variants: {
			intent: {
				primary: "text-white bg-slate-500 disabled:bg-slate-400",
				secondary:
					"outline outline-2 -outline-offset-2 outline-slate-500 text-slate-500 disabled:outline-slate-400 disabled:text-slate-400",
				tertiary:
					"text-slate-400 disabled:text-slate-300 underline underline-offset-2",
				destructive: "bg-rose-600 disabled:bg-rose-400 disabled:cursor-not-allowed text-white"
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
	React.ComponentProps<"button"> & {
		/** Show loading spinner and disable button */ loading?: boolean;
	};
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			intent,
			fullWidth,
			className,
			loading,
			disabled,
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
			disabled={loading || disabled}
		>
			{loading && <Spinner />}
			{children}
		</button>
	)
);

export default Button;
