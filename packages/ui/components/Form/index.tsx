import { ComponentProps } from "react";
import {
	FieldValues,
	FormProvider,
	SubmitHandler,
	UseFormReturn,
	useForm,
	UseFormProps
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Props<T extends FieldValues>
	extends Omit<ComponentProps<"form">, "onSubmit"> {
	form: UseFormReturn<T>;
	onSubmit: SubmitHandler<T>;
}

const Form = <T extends FieldValues>({
	form,
	onSubmit,
	children,
	style,
	className,
	...props
}: Props<T>) => (
	<FormProvider {...form}>
		<form onSubmit={form.handleSubmit(onSubmit)} {...props}>
			{/* <fieldset> passes the form's 'disabled' state to all of its elements,
            allowing us to handle disabled style variants with just css */}
			<fieldset
				disabled={form.formState.isSubmitting}
				className={className}
				style={style}
			>
				{children}
			</fieldset>
		</form>
	</FormProvider>
);

export { default as FormField } from "./form-field";
export { default as FormInput } from "./form-input";
export { default as FormCombobox } from "./form-combobox";
export { default as FormSelect } from "./form-select";
export default Form;

interface UseZodFormProps<S extends z.ZodSchema>
	extends Exclude<UseFormProps<z.infer<S>>, "resolver"> {
	schema: S;
}

export const useZodForm = <S extends z.ZodSchema>({
	schema,
	...formProps
}: UseZodFormProps<S>) =>
	useForm({
		reValidateMode: "onChange",
		...formProps,
		resolver: zodResolver(schema)
	});
