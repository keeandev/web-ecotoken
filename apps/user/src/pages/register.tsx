import { RouterInputs, trpc } from "@/utils/trpc";
import { createUserSchema } from "@ecotoken/api/src/schema/user";
import Button from "@ecotoken/ui/components/Button";
import Input from "@ecotoken/ui/components/Input";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { NextPageWithLayout } from "./_app";
import { zodResolver } from "@hookform/resolvers/zod";

type RegisterFormInput = RouterInputs["userAuth"]["register"];

const Register: NextPageWithLayout = () => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<RegisterFormInput>({
		resolver: zodResolver(createUserSchema)
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

	const onSubmit = async ({
		email,
		username,
		password
	}: RegisterFormInput) => {
		await mutate({
			email,
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
					label="Email"
					error={errors.email?.message ?? ""}
					{...register("email")}
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
				<Button fullWidth loading={isLoading}>
					Register
				</Button>
			</form>
		</div>
	);
};

Register.getLayout = (page) => <>{page}</>;

export default Register;
