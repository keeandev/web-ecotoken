import { trpc } from "@/utils/trpc";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
	FormInput,
	FormSelect,
	useZodForm
} from "@ecotoken/ui/components/Form";
import Spinner from "@ecotoken/ui/components/Spinner";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import toast from "react-hot-toast";
import generator from "generate-password";
import { updateAdminUserSchema } from "@ecotoken/api/src/schema/admin-user";

const AdminUserEdit = () => {
	const router = useRouter();
	const context = trpc.useContext();
	const { id } = router.query;
	const { data: user, isLoading: isFetching } = trpc.adminUsers.get.useQuery(
		{
			id: id as string
		},
		{
			refetchOnWindowFocus: false,
			enabled: !!id,
			onSuccess(data) {
				form.reset({
					...data,
					password: undefined
				});
			}
		}
	);

	const { mutate, isLoading } = trpc.adminUsers.update.useMutation({
		onSuccess: async () => {
			await context.adminUsers.invalidate();
			await context.adminUsers.get.invalidate({
				id: id as string
			});
			toast.success("Admin user has been edited.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});

	const { mutate: deleteMutate, isLoading: isDeleting } =
		trpc.adminUsers.delete.useMutation({
			onSuccess: async () => {
				await context.adminUsers.invalidate();
				router.push("/admin-users");
				toast.success("Admin user has been deleted.");
			},
			onError(e) {
				toast.error(e.message);
			}
		});

	const form = useZodForm({
		schema: updateAdminUserSchema
	});

	const { data: roles, isLoading: areRolesLoading } =
		trpc.roles.getAll.useInfiniteQuery({});

	const mappedRoles = useMemo(
		() => roles?.pages.flatMap((page) => page.roles),
		[roles]
	);

	if (!user) {
		if (isFetching) return <Spinner />;
		else {
			toast.error("User does not exist.");
			router.push("/admin-users");
			return null;
		}
	} else {
		return (
			<Transition
				as={Fragment}
				show
				appear
				enter="ease-out duration-500"
				enterFrom="opacity-0 -translate-y-2"
				enterTo="opacity-100 translate-y-0"
				leave="ease-in duration-500"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 -translate-y-2"
			>
				<div className="space-y-4">
					<div className="flex space-x-2">
						<Link href="/admin-users" className="inline-block">
							<FontAwesomeIcon
								icon={faArrowLeft}
								size="lg"
								className="mt-1.5 text-slate-400"
							/>
						</Link>
						<div>
							<CardTitle>Edit User</CardTitle>
							<CardDescription>
								Update a user in the database.
							</CardDescription>
						</div>
					</div>
					<Form
						form={form}
						onSubmit={async (adminUser) => {
							await mutate({
								...adminUser,
								adminID: id as string,
								password: !!adminUser.password
									? adminUser.password
									: undefined,
								confirmPassword: !!adminUser.confirmPassword
									? adminUser.confirmPassword
									: undefined
							});
						}}
						className="flex w-full flex-col gap-4"
					>
						<div className="flex flex-col gap-4 md:flex-row">
							<FormSelect
								label="Role"
								{...form.register("roleID")}
							>
								{mappedRoles?.map((role) => (
									<option
										key={role.roleID}
										value={role.roleID}
									>
										{role.role}
									</option>
								))}
							</FormSelect>
						</div>
						<div className="flex flex-col gap-4 md:flex-row">
							<FormInput
								label="First Name"
								size="lg"
								{...form.register("firstName")}
							/>
							<FormInput
								label="Last Name"
								size="lg"
								{...form.register("lastName")}
							/>
						</div>
						<div className="flex flex-col gap-4 md:flex-row">
							<FormInput
								label="Email"
								size="lg"
								type="email"
								{...form.register("email")}
							/>
							<FormInput
								label="Username"
								size="lg"
								{...form.register("username")}
							/>
						</div>
						<div>
							<div className="flex flex-col gap-4 md:flex-row">
								<FormInput
									label="Password"
									size="lg"
									{...form.register("password")}
								/>
								<FormInput
									label="Confirm Password"
									size="lg"
									{...form.register("confirmPassword", {
										deps: ["password"],
										validate: (value) => {
											const { password } =
												form.getValues();
											return (
												password === value ||
												"Passwords don't match!"
											);
										}
									})}
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
						<div className="w-full space-y-1.5">
							<Button loading={isLoading} fullWidth>
								Update
							</Button>
							<Button
								intent="destructive"
								type="button"
								fullWidth
								loading={isDeleting}
								onClick={async () => {
									await deleteMutate({
										id: id as string
									});
								}}
							>
								Delete
							</Button>
						</div>
					</Form>
				</div>
			</Transition>
		);
	}
};

export default AdminUserEdit;
