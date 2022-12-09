import { cva, type VariantProps } from "class-variance-authority";

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
	React.ComponentProps<"input">;
const Input: React.FC<InputProps> = ({
	type,
	intent,
	fullWidth,
	className,
	...props
}) => {
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
};

export default Input;
