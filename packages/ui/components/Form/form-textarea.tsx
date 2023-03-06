import { forwardRef } from "react";
import Root, { type Props as RootProps } from "../TextArea";
import FormField, { type UseFormFieldProps, useFormField } from "./form-field";

interface Props extends UseFormFieldProps, RootProps {
    name: string;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const { formFieldProps, childProps } = useFormField(props);

    return (
        <FormField {...formFieldProps}>
            <Root {...childProps} ref={ref} />
        </FormField>
    );
});

export default FormTextArea;
