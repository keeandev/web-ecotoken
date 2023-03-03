import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import { loginAdminUserSchema } from "@ecotoken/api/src/schema/admin-user";
import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "@/utils/trpc";

const Login = () => {
	const { mutateAsync, isLoading } = trpc.adminAuth.login.useMutation({
		onSuccess() {
			router.push("/");
			toast.success("Login success.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});
	const router = useRouter();

	const form = useZodForm({
		schema: loginAdminUserSchema
	});

	return (
		<div className="flex h-full w-full items-center justify-center">
			<Form
				form={form}
				onSubmit={async ({ username, password }) => {
					await mutateAsync({
						username,
						password
					});
				}}
				className="m-4 space-y-4 rounded-md bg-slate-200 p-4"
			>
				<FormInput
					label="Username"
					size="full"
					{...form.register("username")}
				/>
				<FormInput
					size="full"
					label="Password"
					type="password"
					{...form.register("password")}
				/>
				<Button fullWidth loading={isLoading}>
					Login
				</Button>
			</Form>
		</div>
	);
};

Login.getLayout = (page: React.ReactElement) => <>{page}</>;
export default Login;
