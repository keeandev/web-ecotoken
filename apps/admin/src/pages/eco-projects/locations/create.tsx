import { createEcoLocationSchema } from "@ecotoken/api/src/schema/location";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@ecotoken/ui/components/Button";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { Fragment } from "react";
import Link from "next/link";
import React from "react";
import clsx from "clsx";

import { Country, State } from "country-state-city";

import Form, {
	useZodForm,
	FormInput,
	FormSelect
} from "@ecotoken/ui/components/Form";

export const CreateEcoLocation: React.FC = () => {
	const router = useRouter();
	const context = trpc.useContext();

	const { mutate, isLoading } = trpc.ecoLocations.create.useMutation({
		onSuccess: async (data) => {
			await context.ecoLocations.getAll.invalidate();
			router.push(`/eco-projects/locations/${data.siteID}/edit`);
			toast.success("Location has been created.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});

	const { data: activeSiteID, isLoading: fetchingSite } =
		trpc.websites.getCurrentSite.useQuery();

	const form = useZodForm({
		schema: createEcoLocationSchema.omit({
			siteID: true
		}),
		reValidateMode: "onChange",
		defaultValues: {
			cn: undefined,
			location: undefined,
			st: undefined
		}
	});

	const country = form.watch("cn");

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
					<Link
						href="/eco-projects/locations"
						className="inline-block"
					>
						<FontAwesomeIcon
							icon={faArrowLeft}
							size="lg"
							className="mt-1.5 text-slate-400"
						/>
					</Link>
					<div>
						<CardTitle>Create Location</CardTitle>
						<CardDescription>
							Create a location for ecoProjects.
						</CardDescription>
					</div>
				</div>
				<Form
					form={form}
					className={clsx("flex w-full flex-col gap-4")}
					onSubmit={async (location) => {
						if (activeSiteID)
							await mutate({
								...location,
								siteID: activeSiteID
							});
					}}
				>
					<FormInput
						label="Location"
						size="full"
						{...form.register("location")}
					/>
					<FormSelect
						label="Country"
						size="full"
						defaultValue=""
						{...form.register("cn")}
					>
						<option value="" hidden></option>
						{Country.getAllCountries().map((country) => (
							<option
								key={country.isoCode}
								value={country.isoCode}
							>
								{country.name}
							</option>
						))}
					</FormSelect>
					<FormSelect
						label="State/Province"
						size="full"
						defaultValue=""
						{...form.register("st")}
					>
						<option value="" hidden></option>
						{country &&
							State.getStatesOfCountry(country).map((country) => (
								<option
									key={country.isoCode}
									value={country.isoCode}
								>
									{country.name}
								</option>
							))}
					</FormSelect>
					<Button loading={isLoading || fetchingSite} fullWidth>
						Create
					</Button>
				</Form>
			</div>
		</Transition>
	);
};

export default CreateEcoLocation;
