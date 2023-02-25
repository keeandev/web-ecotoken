import { trpc } from "@/utils/trpc";
import { createUserSchema } from "@ecotoken/api/src/schema/user";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import generator from "generate-password";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const CreateUser = () => {
	const router = useRouter();
	const { mutate, isLoading } = trpc.users.create.useMutation({
		onSuccess() {
			router.push("/users");
			toast.success("User created successfully.");
		}
	});
	const form = useZodForm({
		schema: createUserSchema.omit({
			roleID: true
		})
	});

	const { data: role, isLoading: fetchingRole } = trpc.roles.get.useQuery({
		name: "User"
	});

	return (
		<div className="space-y-4">
			<div className="flex space-x-2">
				<Link href="/users" className="inline-block">
					<FontAwesomeIcon
						icon={faArrowLeft}
						size="lg"
						className="mt-1.5 text-slate-400"
					/>
				</Link>
				<div>
					<CardTitle>Create User</CardTitle>
					<CardDescription>
						Create a user in the database.
					</CardDescription>
				</div>
			</div>
			<Form
				form={form}
				onSubmit={async (data) => {
					if (role) await mutate({ ...data, roleID: role?.roleID });
				}}
				className="flex w-full flex-col gap-4"
			>
				<FormInput
					wrapperClass="w-full"
					label="Company Name"
					size="full"
					{...form.register("companyName")}
				/>
				<div className="flex flex-col gap-4 md:flex-row">
					<FormInput
						wrapperClass="w-full"
						label="First Name"
						size="full"
						className="flex flex-1"
						{...form.register("firstName")}
					/>
					<FormInput
						label="Last Name"
						size="full"
						wrapperClass="w-full"
						className="flex flex-1"
						{...form.register("lastName")}
					/>
				</div>
				<div className="flex flex-col gap-4 md:flex-row">
					<FormInput
						label="Username"
						{...form.register("username")}
					/>
					<FormInput
						label="Email"
						type="email"
						{...form.register("email")}
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
		</div>
	);
};

export default CreateUser;
