import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const cardStyles = cva(["p-4 rounded-md"], {
	variants: {
		intent: {
			primary: "border border-slate-200 bg-white"
		},
		size: {
			// sm: "",
			// md: "",
			// lg: "",
			// xl: "",
			quarter: "w-1/4",
			half: "w-1/2",
			third: "w-1/3",
			twoThird: "w-2/3",
			threeQuarter: "w-3/4",
			full: "w-full",
			default: "w-fit"
		}

		// 'sm': {'min': '640px', 'max': '767px'},
		// => @media (min-width: 640px and max-width: 767px) { ... }     'md': {'min': '768px', 'max': '1023px'},
		// => @media (min-width: 768px and max-width: 1023px) { ... }    'lg': {'min': '1024px', 'max': '1279px'},
		// => @media (min-width: 1024px and max-width: 1279px) { ... }       'xl': {'min': '1280px', 'max': '1535px'},
		// => @media (min-width: 1280px and max-width: 1535px) { ... }       '2xl': {'min': '1536px'},
	},
	defaultVariants: {
		intent: "primary",
		size: "default"
	}
});

export type DefaultCardProps = VariantProps<typeof cardStyles> &
	React.ComponentProps<"div">;
const DefaultCard: React.FC<DefaultCardProps> = ({
	children,
	intent,
	size,
	className,
	...props
}) => {
	return (
		<div
			className={cardStyles({ intent, size, class: className })}
			{...props}
		>
			{children}
		</div>
	);
};

export default DefaultCard;
