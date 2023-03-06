import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const cardStyles = cva(["p-6 rounded-md shadow-sm"], {
    variants: {
        intent: {
            primary: "border border-slate-200 bg-slate-100",
            secondary: "border border-slate-300 bg-slate-200",
        },
        size: {
            md: "w-36",
            lg: "w-64",
            xl: "w-72",
            "2xl": "w-96",
            quarter: "w-1/4",
            half: "w-1/2",
            third: "w-1/3",
            twoThird: "w-2/3",
            threeQuarter: "w-3/4",
            full: "w-full",
            default: "",
        },
        shadow: {
            sm: "shadow-sm",
            md: "shadow-md",
            lg: "shadow-lg",
            xl: "shadow-xl",
        },
        // 'sm': {'min': '640px', 'max': '767px'},
        // => @media (min-width: 640px and max-width: 767px) { ... }     'md': {'min': '768px', 'max': '1023px'},
        // => @media (min-width: 768px and max-width: 1023px) { ... }    'lg': {'min': '1024px', 'max': '1279px'},
        // => @media (min-width: 1024px and max-width: 1279px) { ... }       'xl': {'min': '1280px', 'max': '1535px'},
        // => @media (min-width: 1280px and max-width: 1535px) { ... }       '2xl': {'min': '1536px'},
    },
    defaultVariants: {
        intent: "primary",
        size: "default",
        shadow: "sm",
    },
});

export interface DefaultCardProps
    extends VariantProps<typeof cardStyles>,
        React.ComponentProps<"div"> {}
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

export const CardTitle: React.FC<React.ComponentProps<"h3">> = ({
    className,
    ...props
}) => (
    <h3
        className={clsx("text-2xl font-bold text-slate-700", className)}
        {...props}
    />
);

export const CardDescription: React.FC<React.ComponentProps<"h3">> = ({
    className,
    ...props
}) => (
    <h5
        className={clsx("appearance-none text-slate-700", className)}
        {...props}
    />
);

export default DefaultCard;
