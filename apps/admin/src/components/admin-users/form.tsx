import AdminUserCreateForm, { type AdminCreateFormProps } from "./create-form";
import EditUserForm, { type AdminEditFormProps } from "./edit-form";

const Form: React.FC<
	Omit<React.ComponentProps<"form">, "onSubmit"> &
		(AdminCreateFormProps | AdminEditFormProps) & { new?: boolean }
> = ({ loading = false, ...props }) => {
	if (props.new) {
		props = props as AdminCreateFormProps;
		return (
			<AdminUserCreateForm
				loading={loading}
				onCreate={props.onCreate}
				{...props}
			/>
		);
	} else {
		props = props as AdminEditFormProps;
		<EditUserForm
			loading={loading}
			onDelete={props.onDelete}
			onSave={props.onSave}
			user={props.user}
			reset={props.reset}
			{...props}
		/>;
	}
	return null;
};

export default Form;
