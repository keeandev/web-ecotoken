import Button from "@ecotoken/ui/components/Button";
import Input from "@ecotoken/ui/components/Input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { RouterInputs, trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@ecotoken/api/src/schema/user";
import Link from "@ecotoken/ui/components/Link";
import logo from "@ecotoken/ui/assets/brand/logo.png";
import Image from "next/image";
import { z } from "zod";

type LoginFormInput = RouterInputs["userAuth"]["login"];

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<z.infer<typeof loginUserSchema>>({
		resolver: zodResolver(loginUserSchema)
	});

	const { mutate, isLoading } = trpc.userAuth.login.useMutation({
		retry: false,
		onSuccess() {
			router.push("/");
			toast.success("Login success.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});
	const router = useRouter();

	const onSubmit = async ({ user, password }: LoginFormInput) => {
		await mutate({
			user,
			password
		});
	};

	return (
		<div className="flex h-full w-full flex-col items-center justify-center space-y-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6 rounded-md border border-slate-300 bg-slate-200 p-8"
			>
				<div className="flex flex-col items-center space-y-4">
					<div className="relative h-12 min-h-[2rem] w-12 min-w-[2rem]">
						<Image
							src={logo}
							alt="ecoToken logo"
							fill
							className="object-contain grayscale"
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
				<Input
					fullWidth
					label="Username or email address"
					error={errors.user?.message ?? ""}
					{...register("user")}
				/>
				<div className="relative flex flex-col space-y-0.5">
					<Input
						fullWidth
						label="Password"
						type="password"
						error={errors.password?.message ?? ""}
						{...register("password")}
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
			</form>
		</div>
	);
};

Login.getLayout = (page: React.ReactElement) => <>{page}</>;
export default Login;
