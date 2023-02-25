import { forwardRef } from "react";
import Root, { type InputProps as RootProps } from "../Input";
import FormField, { type UseFormFieldProps, useFormField } from "./form-field";

type Props = UseFormFieldProps & RootProps;

const FormInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
	const { formFieldProps, childProps } = useFormField(props);
	return (
		<FormField {...formFieldProps}>
			<Root {...childProps} ref={ref} />
		</FormField>
	);
});

export default FormInput;
