import { RouterInputs, trpc } from "@/utils/trpc";
import { createUserSchema } from "@ecotoken/api/src/schema/user";
import Button from "@ecotoken/ui/components/Button";
import Input from "@ecotoken/ui/components/Input";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { NextPageWithLayout } from "./_app";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@ecotoken/ui/assets/brand/logo.png";
import Image from "next/image";
import Link from "@ecotoken/ui/components/Link";

type RegisterFormInput = RouterInputs["userAuth"]["register"];

const Register: NextPageWithLayout = () => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<RegisterFormInput>({
		// add the confirm password verifier only to the form, ignoring the official schema to allow
		resolver: zodResolver(
			createUserSchema.superRefine(
				({ password, confirmPassword }, ctx) => {
					if (confirmPassword !== password) {
						ctx.addIssue({
							code: "custom",
							path: ["confirmPassword"],
							message: "Passwords do not match!"
						});
					}
				}
			)
		)
	});

	const router = useRouter();

	const { mutate, isLoading } = trpc.userAuth.register.useMutation({
		onSuccess() {
			router.push("/email-verification");
		},
		onError(e) {
			toast.error(e.message);
		}
	});

	const onSubmit = async (values: RegisterFormInput) => {
		await mutate({
			...values
		});
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="max-w-sm space-y-4 rounded-md border border-slate-300 bg-slate-200 p-6"
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
							Register
						</h1>
						<h3 className="appearance-none text-sm text-slate-700">
							Register for an ecoToken account.
						</h3>
					</div>
				</div>
				<div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
					<Input
						className="flex-1"
						fullWidth
						label="First name"
						error={errors.firstName?.message ?? ""}
						{...register("firstName")}
					/>
					<Input
						className="flex-1"
						fullWidth
						label="Last name"
						error={errors.lastName?.message ?? ""}
						{...register("lastName")}
					/>
				</div>
				<Input
					fullWidth
					label="Email"
					error={errors.emailAddress?.message ?? ""}
					{...register("emailAddress")}
				/>
				<Input
					fullWidth
					label="Username"
					error={errors.username?.message ?? ""}
					{...register("username")}
				/>
				<Input
					fullWidth
					label="Password"
					type="password"
					error={errors.password?.message ?? ""}
					{...register("password")}
				/>
				<Input
					fullWidth
					label="Confirm Password"
					type="password"
					error={errors.confirmPassword?.message ?? ""}
					{...register("confirmPassword")}
				/>
				<div className="space-y-2">
					<Button fullWidth loading={isLoading}>
						Register
					</Button>
					<span className="block text-center">
						Already have an account?{" "}
						<Link
							href="/login"
							underline={false}
							className="text-right"
						>
							Login here.
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
};

Register.getLayout = (page) => <>{page}</>;

export default Register;
