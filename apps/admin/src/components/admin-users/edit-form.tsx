import Input from "@ecotoken/ui/components/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@ecotoken/ui/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import generator from "generate-password";
import { updateAdminUserSchema } from "@ecotoken/api/src/schema/admin-user";
import { z } from "zod";
import type { AdminUser } from "@ecotoken/db";
import { useEffect } from "react";

export type AdminEditFormProps = {
	user?: AdminUser;
	reset?: UpdateUserType;
	onSave?: (adminUser: UpdateUserType) => void;
	onDelete?: () => void;
	updating?: boolean;
	deleting?: boolean;
};

export type UpdateUserType = z.infer<typeof updateAdminUserSchema>;

const EditUserForm: React.FC<
	Omit<React.ComponentProps<"form">, "onSubmit"> & AdminEditFormProps
> = ({ onDelete, onSave, reset, updating, deleting, user, ...props }) => {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset: formReset,
		formState: { errors }
	} = useForm<UpdateUserType>({
		resolver: zodResolver(updateAdminUserSchema),
		defaultValues: reset,
		reValidateMode: "onChange"
	});

	const onSubmit: SubmitHandler<UpdateUserType> = (data) => {
		if (onSave) onSave(data);
	};

	useEffect(() => {
		formReset(reset);
		console.log("reset");
	}, [user, formReset, reset]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full flex-col gap-4"
			{...props}
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
						{...register("confirmPassword", {
							deps: ["password"],
							validate: (value) => {
								const { password } = getValues();
								return (
									password === value ||
									"Passwords don't match!"
								);
							}
						})}
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
			<div className="w-full space-y-1.5">
				<Button loading={updating} fullWidth>
					Update
				</Button>
				<Button
					intent="destructive"
					type="button"
					fullWidth
					loading={deleting}
					onClick={() => {
						if (onDelete) onDelete();
					}}
				>
					Delete
				</Button>
			</div>
		</form>
	);
};

export default EditUserForm;
