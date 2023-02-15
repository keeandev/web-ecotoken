import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { updateWebsiteSchema } from "@ecotoken/api/src/schema/website";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Spinner from "@ecotoken/ui/components/Spinner";
import Button from "@ecotoken/ui/components/Button";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { Fragment } from "react";
import Link from "next/link";

const EditWebsite = () => {
	const router = useRouter();
	const context = trpc.useContext();
	let { id } = router.query;
	if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
	if (!id) id = "";

	const form = useZodForm({
		schema: updateWebsiteSchema
	});

	const { data: website, isLoading: isFetching } = trpc.websites.get.useQuery(
		{
			siteID: id as string
		},
		{
			enabled: !!id,
			refetchOnWindowFocus: false,
			onSuccess(data) {
				form.reset({
					...data
				});
			}
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
					{/* <EditWebsiteForm
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
					/> */}
					<Form
						form={form}
						className="flex w-full flex-col gap-4"
						onSubmit={async (website) =>
							await mutate({
								...website,
								siteID: id as string
							})
						}
					>
						<div className="flex flex-col gap-4">
							<FormInput
								label="Site Name"
								size="xl"
								fullWidth
								{...form.register("siteName")}
							/>
							<FormInput
								label="Legal Name"
								size="xl"
								fullWidth
								{...form.register("legalName")}
							/>
							<FormInput
								label="Mailing Address"
								size="xl"
								{...form.register("mailAddress")}
								fullWidth
							/>
							<FormInput
								label="Production URL"
								size="xl"
								fullWidth
								{...form.register("prodUrl")}
							/>
							<FormInput
								label="Staging URL"
								size="xl"
								fullWidth
								{...form.register("stageUrl")}
							/>
							<FormInput
								label="Development URL"
								size="xl"
								fullWidth
								{...form.register("devUrl")}
							/>
						</div>
						<div className="w-full space-y-1.5">
							<Button loading={isLoading} fullWidth>
								Update
							</Button>
							<Button
								type="button"
								loading={isDeleting}
								intent="destructive"
								fullWidth
								onClick={async () =>
									await deleteMutate({
										siteID: id as string
									})
								}
							>
								Delete
							</Button>
						</div>
					</Form>
				</div>
			</Transition>
		);
	}

	return <div>Edit website {id}</div>;
};

export default EditWebsite;
