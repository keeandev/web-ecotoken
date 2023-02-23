import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "@/utils/trpc";
import { loginUserSchema } from "@ecotoken/api/src/schema/user";
import Link from "@ecotoken/ui/components/Link";
import logo from "@ecotoken/ui/assets/brand/logo.png";
import Image from "next/image";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";

const Login = () => {
	const form = useZodForm({
		schema: loginUserSchema
	});

	const { mutate, isLoading } = trpc.userAuth.login.useMutation({
		retry: false,
		onSuccess() {
			router.push("/user");
			toast.success("Login success.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});
	const router = useRouter();

	return (
		<div className="flex h-full w-full flex-col items-center justify-center space-y-4">
			<Form
				form={form}
				onSubmit={async ({ user, password }) => {
					await mutate({
						user,
						password
					});
				}}
				className="space-y-6 rounded-md border border-slate-300 bg-slate-200 p-8"
			>
				<div className="flex flex-col items-center space-y-4">
					<div className="relative h-12 min-h-[2rem] w-12 min-w-[2rem]">
						<Image
							src={logo}
							alt="ecoToken logo"
							fill
							className="object-contain"
						/>
					</div>
					<div className="text-center">
						<h1 className="appearance-none text-xl font-bold text-slate-700">
							Login
						</h1>
						<h3 className="appearance-none text-sm text-slate-700">
							Sign-in to your ecoToken account.
						</h3>
					</div>
				</div>
				<FormInput
					size="full"
					label="Username or email address"
					{...form.register("user")}
				/>
				<div className="relative flex flex-col space-y-0.5">
					<FormInput
						size="full"
						label="Password"
						type="password"
						{...form.register("password")}
					/>
					<Link
						href="/forgot-password"
						underline={false}
						className="absolute top-0 right-0 text-xs font-semibold"
					>
						Forgot your password?
					</Link>
				</div>
				<div className="space-y-2">
					<Button fullWidth loading={isLoading}>
						Login
					</Button>
					<span className="block text-center">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							underline={false}
							className="text-right"
						>
							Register here.
						</Link>
					</span>
				</div>
			</Form>
		</div>
	);
};

Login.getLayout = (page: React.ReactElement) => <>{page}</>;
export default Login;
