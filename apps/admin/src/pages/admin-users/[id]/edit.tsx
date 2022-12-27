import EditUserForm from "@/components/admin-users/edit-form";
import { trpc } from "@/utils/trpc";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Spinner from "@ecotoken/ui/components/Spinner";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import toast from "react-hot-toast";

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
			enabled: !!id
		}
	);

	const { mutate, isLoading } = trpc.adminUsers.update.useMutation({
		onSuccess: async () => {
			await context.adminUsers.invalidate();
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
					<EditUserForm
						updating={isLoading}
						deleting={isDeleting}
						{...(user && {
							user,
							reset: {
								id: user.adminID,
								username: user.username,
								email: user.email,
								firstName: user.firstName,
								lastName: user.lastName ?? ""
							}
						})}
						onSave={async (adminUser) =>
							await mutate({
								...adminUser,
								id: id as string
							})
						}
						onDelete={async () =>
							await deleteMutate({
								id: id as string
							})
						}
					/>
				</div>
			</Transition>
		);
	}
};

export default AdminUserEdit;
