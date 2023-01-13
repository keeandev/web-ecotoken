import Input from "@ecotoken/ui/components/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@ecotoken/ui/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@ecotoken/api/src/schema/user";
import { z } from "zod";

export type AdminCreateFormProps = {
	onCreate?: (adminUser: CreateUserType) => void;
	loading?: boolean;
};

export type CreateUserType = z.infer<typeof createUserSchema>;

const UserCreateForm: React.FC<
	Omit<React.ComponentProps<"form">, "onSubmit"> & AdminCreateFormProps
> = ({ onCreate, loading }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm<CreateUserType>({
		resolver: zodResolver(createUserSchema),
		reValidateMode: "onChange"
	});

	const onSubmit: SubmitHandler<CreateUserType> = (data) => {
		if (onCreate)
			onCreate({
				...data
			});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full flex-col gap-4"
		>
			<div className="flex flex-col gap-4 md:flex-row">
				<Input
					label="Username"
					size="lg"
					{...register("username")}
					error={errors.username?.message}
				/>
				<Input
					label="Email Address"
					size="lg"
					error={errors.emailAddress?.message}
					{...register("emailAddress")}
				/>
			</div>
			<Button loading={loading} fullWidth>
				Create
			</Button>
		</form>
	);
};

export default UserCreateForm;
