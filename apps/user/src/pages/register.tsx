import { RouterInputs, trpc } from "@/utils/trpc";
import { createUserSchema } from "@ecotoken/api/src/schema/user";
import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import { toast } from "react-hot-toast";
import { NextPageWithLayout } from "./_app";
import logo from "@ecotoken/ui/assets/brand/logo.png";
import Image from "next/image";
import Link from "@ecotoken/ui/components/Link";

type RegisterFormInput = RouterInputs["userAuth"]["register"];

const Register: NextPageWithLayout = () => {
	const form = useZodForm({
		// add the confirm password verifier only to the form, ignoring the official schema to allow
		schema: createUserSchema.superRefine(
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
			<Form
				form={form}
				onSubmit={onSubmit}
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
				{/* 
                    Couldn't get flex-1 working again. Randy, if you want to take a shot at it go ahead. Good luck!
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
					<FormInput
						// wrapperClass="flex flex-col flex-1"
						size="full"
						label="First name"
						{...form.register("firstName")}
					/>
					<FormInput
						// wrapperClass="flex flex-col flex-1"
						size="full"
						label="Last name"
						{...form.register("lastName")}
					/>
				</div> */}
				<FormInput
					wrapperClass="flex flex-col flex-1"
					size="full"
					label="First name"
					{...form.register("firstName")}
				/>
				<FormInput
					wrapperClass="flex flex-col flex-1"
					size="full"
					label="Last name"
					{...form.register("lastName")}
				/>
				<FormInput
					size="full"
					label="Email"
					{...form.register("emailAddress")}
				/>
				<FormInput
					size="full"
					label="Username"
					{...form.register("username")}
				/>
				<FormInput
					size="full"
					label="Password"
					type="password"
					{...form.register("password")}
				/>
				<FormInput
					size="full"
					label="Confirm Password"
					type="password"
					{...form.register("confirmPassword")}
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
			</Form>
		</div>
	);
};

Register.getLayout = (page) => <>{page}</>;

export default Register;
