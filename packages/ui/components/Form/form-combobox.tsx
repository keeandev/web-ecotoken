import { forwardRef } from "react";
import Root, { ComboboxProps as RootProps, ItemFields } from "../Combobox";
import FormField, { UseFormFieldProps, useFormField } from "./form-field";
import type {
	UseControllerProps,
	PathValue,
	Path,
	FieldValues
} from "react-hook-form";
import { useController } from "react-hook-form";

// override (for this file only) to bring generics to forwardRef correctly
declare module "react" {
	function forwardRef<T, P = {}>(
		render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
	): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

type FormOptionProps<
	T extends FieldValues,
	K extends ItemFields
> = UseControllerProps<T> &
	UseFormFieldProps &
	Omit<RootProps<PathValue<T, Path<T>>, K>, "value" | "onChange">;

const FormOption = <T extends FieldValues, K extends ItemFields>(
	{
		control,
		defaultValue,
		rules,
		shouldUnregister,
		...props
	}: FormOptionProps<T, K>,
	ref: React.ForwardedRef<HTMLDivElement>
) => {
	const {
		field: { onChange, value }
	} = useController({
		control,
		name: props.name,
		defaultValue,
		rules,
		shouldUnregister
	});

	const { formFieldProps, childProps } = useFormField(props);

	// can put wrapper here like with labels, error, etc
	return (
		<FormField {...formFieldProps}>
			<Root {...childProps} ref={ref} onChange={onChange} value={value} />
		</FormField>
	);
};

export default forwardRef(FormOption);
