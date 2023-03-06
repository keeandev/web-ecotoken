import { forwardRef } from "react";
import Root, { type Props as RootProps } from "../Select";
import FormField, { type UseFormFieldProps, useFormField } from "./form-field";

interface Props extends UseFormFieldProps, RootProps {
    name: string;
}

const FormSelect = forwardRef<HTMLSelectElement, Props>((props, ref) => {
    const { formFieldProps, childProps } = useFormField(props);

    return (
        <FormField {...formFieldProps}>
            <Root {...childProps} ref={ref} />
        </FormField>
    );
});

export default FormSelect;
