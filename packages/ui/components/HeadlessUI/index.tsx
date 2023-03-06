import Button, { type ButtonProps } from "@ecotoken/ui/components/Button";
import { Menu as HeadlessMenu } from "@headlessui/react";
import type { VariantProps } from "class-variance-authority";
import { cva, cx } from "class-variance-authority";
import React, { Fragment } from "react";

const menuStyles = cva(["relative"], {
    variants: {
        alignButton: {
            left: "text-left",
            right: " text-right",
        },
        inline: {
            true: "inline-block",
        },
    },
    defaultVariants: {
        alignButton: "right",
    },
});

export interface MenuProps
    extends VariantProps<typeof menuStyles>,
        React.ComponentProps<"div"> {}
const Menu: React.FC<MenuProps> = ({
    className,
    alignButton,
    inline,
    children,
    ...props
}) => {
    return (
        <HeadlessMenu
            as="div"
            className={menuStyles({ alignButton, class: className, inline })}
            {...props}
        >
            {children}
        </HeadlessMenu>
    );
};

const menuButtonStyles = cva([""], {
    variants: {
        intent: {
            none: "",
        },
    },
});

export interface MenuButtonProps
    extends Omit<ButtonProps, "animation" | "ref" | "intent">,
        VariantProps<typeof menuButtonStyles> {}

const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
    ({ className, children, intent = "none", ...props }, ref) => (
        <HeadlessMenu.Button as={Fragment}>
            <Button
                ref={ref}
                animation={false}
                intent={intent}
                className={cx(
                    className,
                    menuButtonStyles({ class: className }),
                )}
                {...props}
            >
                {children}
            </Button>
        </HeadlessMenu.Button>
    ),
);

const menuItemsStyles = cva(["absolute w-56 shadow-md rounded-md border"], {
    variants: {
        intent: {
            primary: "border-slate-200 bg-slate-100",
        },
        align: {
            left: "left-0 origin-top-left ml-2",
            right: "right-0 origin-top-right mr-2",
        },
    },
    defaultVariants: {
        align: "left",
        intent: "primary",
    },
});

export interface MenuItemsProps
    extends VariantProps<typeof menuItemsStyles>,
        React.ComponentProps<"div"> {}
const MenuItems = React.forwardRef<HTMLDivElement, MenuItemsProps>(
    ({ className, align, children }, ref) => (
        <HeadlessMenu.Items
            as="div"
            className={cx(menuItemsStyles({ class: className, align }))}
            ref={ref}
        >
            {children}
        </HeadlessMenu.Items>
    ),
);

export { Menu, MenuButton, MenuItems };
