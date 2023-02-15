import clsx from "clsx";
import { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import Label from "../Label";

export type UseFormFieldProps = PropsWithChildren<{
	wrapperClass?: string;
	name: string;
	label: string;
}>;

export const useFormField = <P extends UseFormFieldProps>(props: P) => {
	const { label, name, wrapperClass, ...otherProps } = props;
	const id = name;

	return {
		formFieldProps: { id, name, label, wrapperClass },
		childProps: { ...otherProps, id, name }
	};
};

interface Props extends UseFormFieldProps {
	id: string;
}

const FormField = ({
	children,
	name,
	id,
	label,
	wrapperClass: parentClass
}: Props) => {
	const ctx = useFormContext();
	const { error } = ctx.getFieldState(name, ctx.formState);

	return (
		<div className={clsx("space-y-1", parentClass)}>
			<Label htmlFor={id} className="block">
				{label}
			</Label>
			{children}
			{error && (
				<p className="block text-xs font-medium text-gray-700">
					{error.message}
				</p>
			)}
		</div>
	);
};

export default FormField;
