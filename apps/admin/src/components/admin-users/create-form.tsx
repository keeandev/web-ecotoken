import Input from "@ecotoken/ui/components/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@ecotoken/ui/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import generator from "generate-password";
import { createUserSchema } from "@ecotoken/api/src/schema/admin-user";
import { z } from "zod";

export type AdminCreateFormProps = {
	onCreate?: (adminUser: CreateUserType) => void;
	loading?: boolean;
};

export type CreateUserType = z.infer<typeof createUserSchema>;

const AdminCreateForm: React.FC<
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
		if (onCreate) onCreate(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full flex-col gap-4"
		>
			<div className="flex flex-col gap-4 md:flex-row">
				<Input
					label="First Name"
					size="lg"
					{...register("firstName")}
					error={errors.firstName?.message}
				/>
				<Input
					label="Last Name"
					size="lg"
					error={errors.lastName?.message}
					{...register("lastName")}
				/>
			</div>
			<div className="flex flex-col gap-4 md:flex-row">
				<Input
					label="Email"
					size="lg"
					type="email"
					error={errors.email?.message}
					{...register("email")}
				/>
				<Input
					label="Username"
					size="lg"
					error={errors.username?.message}
					{...register("username")}
				/>
			</div>
			<div>
				<div className="flex flex-col gap-4 md:flex-row">
					<Input
						label="Password"
						size="lg"
						error={errors.password?.message}
						{...register("password")}
					/>
					<Input
						label="Confirm Password"
						size="lg"
						error={errors.confirmPassword?.message}
						{...register("confirmPassword")}
					/>
				</div>
				<span
					className="cursor-pointer select-none text-xs text-slate-400 underline underline-offset-2 ease-linear hover:text-slate-500"
					onClick={() => {
						const password = generator.generate({
							length: 20,
							numbers: true,
							symbols: true,
							strict: true
						});
						setValue("password", password);
						setValue("confirmPassword", password);
					}}
				>
					Generate a secure password automatically
				</span>
			</div>
			<Button loading={loading} fullWidth>
				Create
			</Button>
		</form>
	);
};

export default AdminCreateForm;
