import EditWebsiteForm from "@/components/websites/edit-form";
import { trpc } from "@/utils/trpc";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Spinner from "@ecotoken/ui/components/Spinner";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { toast } from "react-hot-toast";

const EditWebsite = () => {
	const router = useRouter();
	const context = trpc.useContext();
	let { id } = router.query;
	if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
	if (!id) id = "";
	const { data: website, isLoading: isFetching } = trpc.websites.get.useQuery(
		{
			siteID: id as string
		},
		{
			enabled: !!id,
			refetchOnWindowFocus: false
		}
	);

	const { mutate, isLoading } = trpc.websites.update.useMutation({
		onSuccess: async () => {
			await context.websites.get.invalidate({
				siteID: id as string
			});
			await context.websites.getAll.invalidate();
			toast.success("Website has been edited.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});

	const { mutate: deleteMutate, isLoading: isDeleting } =
		trpc.websites.delete.useMutation({
			onSuccess: async () => {
				await context.websites.getAll.invalidate();
				router.push("/websites");
				toast.success("Website has been deleted.");
			},
			onError(e) {
				toast.error(e.message);
			}
		});

	if (!website) {
		if (isFetching) return <Spinner />;
		else {
			toast.error("Website does not exist.");
			router.push("/websites");
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
						<Link href="/websites" className="inline-block">
							<FontAwesomeIcon
								icon={faArrowLeft}
								size="lg"
								className="mt-1.5 text-slate-400"
							/>
						</Link>
						<div>
							<CardTitle>Edit Website</CardTitle>
							<CardDescription>
								Update a website in the database.
							</CardDescription>
						</div>
					</div>
					<EditWebsiteForm
						updating={isLoading}
						deleting={isDeleting}
						{...(website && {
							site: website,
							reset: {
								siteID: website.siteID,
								siteName: website.siteName,
								legalName: website.legalName,
								mailAddress: website.mailAddress,
								prodUrl: website.prodUrl,
								stageUrl: website.stageUrl,
								devUrl: website.devUrl
							}
						})}
						onSave={async (website) =>
							await mutate({
								...website,
								siteID: id as string
							})
						}
						onDelete={async () =>
							await deleteMutate({
								siteID: id as string
							})
						}
					/>
				</div>
			</Transition>
		);
	}

	return <div>Edit website {id}</div>;
};

export default EditWebsite;
