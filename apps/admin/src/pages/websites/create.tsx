import WebsiteCreateForm from "@/components/websites/create-form";
import { trpc } from "@/utils/trpc";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { toast } from "react-hot-toast";

const CreateWebsite = () => {
	const router = useRouter();
	const context = trpc.useContext();
	const { mutateAsync, isLoading } = trpc.websites.create.useMutation({
		onSuccess: async (data) => {
			router.push(`/websites/${data.siteID}/edit`);
			await context.websites.getAll.invalidate();
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
					<Link href="/websites" className="inline-block">
						<FontAwesomeIcon
							icon={faArrowLeft}
							size="lg"
							className="mt-1.5 text-slate-400"
						/>
					</Link>
					<div>
						<CardTitle>Create Website</CardTitle>
						<CardDescription>Create a website.</CardDescription>
					</div>
				</div>
				<WebsiteCreateForm
					loading={isLoading}
					onCreate={async (website) => {
						await mutateAsync({
							...website
						});
					}}
				/>
			</div>
		</Transition>
	);
};

export default CreateWebsite;
