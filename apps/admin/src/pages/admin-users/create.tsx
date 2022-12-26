import AdminCreateForm from "@/components/admin-users/create-form";
import { trpc } from "@/utils/trpc";
import { CardTitle, CardDescription } from "@ecotoken/ui/components/Card";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import toast from "react-hot-toast";

const AdminUserCreate = () => {
	const router = useRouter();
	const context = trpc.useContext();
	const { mutate, isLoading } = trpc.adminUsers.create.useMutation({
		onSuccess: async () => {
			await context.adminUsers.invalidate();
			router.push("/admin-users");
			toast.success("Admin user has been created.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});
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
						<CardTitle>Create User</CardTitle>
						<CardDescription>
							Create a user in the database.
						</CardDescription>
					</div>
				</div>
				<AdminCreateForm
					loading={isLoading}
					onCreate={async (adminUser) => {
						await mutate({
							...adminUser
						});
					}}
				/>
			</div>
		</Transition>
	);
};

export default AdminUserCreate;
