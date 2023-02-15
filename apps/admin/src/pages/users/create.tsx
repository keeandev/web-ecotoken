import { trpc } from "@/utils/trpc";
import { createUserSchema } from "@ecotoken/api/src/schema/user";
import Button from "@ecotoken/ui/components/Button";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import generator from "generate-password";

const CreateUser = () => {
	const { mutate, isLoading } = trpc.users.create.useMutation();
	const form = useZodForm({
		schema: createUserSchema.omit({
			roleID: true
		})
	});

	const { data: role, isLoading: fetchingRole } = trpc.roles.get.useQuery({
		name: "User"
	});

	return (
		<Form
			form={form}
			onSubmit={async (data) => {
				if (role) await mutate({ ...data, roleID: role?.roleID });
			}}
			className="flex w-full flex-col gap-4"
		>
			<div className="flex flex-col gap-4 md:flex-row">
				<FormInput
					label="First Name"
					size="md"
					{...form.register("firstName")}
				/>
				<FormInput
					label="Last Name"
					size="md"
					{...form.register("lastName")}
				/>
			</div>
			<div className="flex flex-col gap-4 md:flex-row">
				<FormInput label="Username" {...form.register("username")} />
				<FormInput
					label="Email"
					type="email"
					{...form.register("emailAddress")}
				/>
			</div>
			<div>
				<div className="flex flex-col gap-4 md:flex-row">
					<FormInput
						label="Password"
						{...form.register("password")}
					/>
					<FormInput
						label="Confirm Password"
						{...form.register("confirmPassword")}
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
						form.setValue("password", password);
						form.setValue("confirmPassword", password);
					}}
				>
					Generate a secure password automatically
				</span>
			</div>
			<Button loading={isLoading || fetchingRole} fullWidth>
				Create
			</Button>
		</Form>
	);
};

export default CreateUser;
