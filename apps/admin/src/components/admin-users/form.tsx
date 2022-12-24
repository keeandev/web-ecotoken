import Input from "@ecotoken/ui/components/Input";
import { type RouterInputs } from "@/utils/trpc";
import { AdminUser } from "@ecotoken/db";
import { useForm } from "react-hook-form";
import Button from "@ecotoken/ui/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import generator from "generate-password";
import {
	createUserSchema,
	updateUserSchema
} from "@ecotoken/api/src/schema/admin-user";

type AdminUserFormProps = {
	user?: AdminUser;
	onDelete?: () => void;
	onSave?: (adminUser: UpdateAdminUser) => void;
	onCreate?: (adminUser: CreateAdminUser) => void;
	loading?: boolean;
	new?: boolean;
};

type CreateAdminUser = RouterInputs["adminUsers"]["create"];
type UpdateAdminUser = RouterInputs["adminUsers"]["update"];

const AdminUserForm: React.FC<
	Omit<React.ComponentProps<"form">, "onSubmit"> & AdminUserFormProps
> = ({ loading = false, user, ...props }) => {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors }
	} = useForm<
		(CreateAdminUser | UpdateAdminUser) & { confirmPassword: string }
	>({
		resolver: zodResolver(props.new ? createUserSchema : updateUserSchema)
	});

	const onSubmit = handleSubmit(async (data) => {
		if (props.onCreate) props.onCreate(data as CreateAdminUser);
		if (props.onSave) props.onSave(data as UpdateAdminUser);
	});

	return (
		<div>
			<form
				{...props}
				onSubmit={onSubmit}
				className="flex flex-col gap-4"
			>
				<div className="flex flex-col gap-4 md:flex-row">
					<Input
						label="First Name"
						size="lg"
						defaultValue={user?.firstName}
						{...register("lastName", { required: props.new })}
						error={errors.firstName?.message}
					/>
					<Input
						label="Last Name"
						size="lg"
						defaultValue={user?.lastName ?? ""}
						error={errors.lastName?.message}
						{...register("firstName", { required: props.new })}
					/>
				</div>
				<div className="flex flex-col gap-4 md:flex-row">
					<Input
						label="Email"
						size="lg"
						defaultValue={user?.email}
						error={errors.email?.message}
						{...register("email", { required: props.new })}
					/>
					<Input
						label="Username"
						size="lg"
						defaultValue={user?.username}
						error={errors.username?.message}
						{...register("username", {
							required: props.new,
							min: 3,
							max: 32
						})}
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
								required: props.new || getValues().password,
								min: 8,
								max: 64,
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
						className="cursor-pointer select-none text-xs text-slate-400 underline underline-offset-2 transition-all duration-150 ease-linear hover:text-slate-500"
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
				<Button loading={loading}>
					{props.new ? "Create" : "Update"}
				</Button>
				{!props.new && <Button intent="destructive">Delete</Button>}
			</form>
		</div>
	);
};

export default AdminUserForm;
