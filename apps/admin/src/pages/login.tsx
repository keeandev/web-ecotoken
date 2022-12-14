import { trpc, type RouterInputs } from "@/utils/trpc";
import Button from "@ecotoken/ui/components/Button";
import Input from "@ecotoken/ui/components/Input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

type LoginFormInput = RouterInputs["adminAuth"]["login"];

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginFormInput>();
	const { mutate, isLoading } = trpc.adminAuth.login.useMutation({
		onSuccess() {
			router.push("/");
			toast.success("Login success.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});
	const router = useRouter();

	const onSubmit = async ({ username, password }: LoginFormInput) => {
		await mutate({
			username,
			password
		});
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="m-4 space-y-4 rounded-md bg-slate-200 p-4"
			>
				<Input
					fullWidth
					label="Username"
					error={errors.username?.message ?? ""}
					{...register("username", { required: true })}
				/>
				<Input
					fullWidth
					label="Password"
					type="password"
					error={errors.password?.message ?? ""}
					{...register("password", { required: true })}
				/>
				<Button fullWidth loading={isLoading}>
					Login
				</Button>
			</form>
		</div>
	);
};

Login.getLayout = (page: React.ReactElement) => <>{page}</>;
export default Login;
