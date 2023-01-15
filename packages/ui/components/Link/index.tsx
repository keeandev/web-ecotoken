import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { LinkProps as NextLinkProps } from "next/link";
import NextLink from "next/link";

const linkStyles = cva([], {
	variants: {
		intent: {
			primary: "text-slate-700 disabled:text-slate-400"
		},
		underline: {
			true: "underline"
		}
	},
	defaultVariants: {
		intent: "primary",
		underline: true
	}
});

export type LinkProps = VariantProps<typeof linkStyles> &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
	NextLinkProps;
const Link: React.FC<LinkProps> = ({
	className,
	intent,
	underline,
	...props
}) => {
	return (
		<NextLink
			className={linkStyles({ intent, underline, class: className })}
			{...props}
		/>
	);
};

export default Link;
