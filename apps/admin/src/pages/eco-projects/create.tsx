import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { createEcoProjectSchema } from "@ecotoken/api/src/schema/project";
import Form, {
	FormInput,
	FormSelect,
	FormTextArea,
	useZodForm
} from "@ecotoken/ui/components/Form";
import Button from "@ecotoken/ui/components/Button";
import { useCallback, useMemo } from "react";
import { Country, State } from "country-state-city";
import { transformEnum } from "@/utils/transformer";

const CreateEcoProject = () => {
	const router = useRouter();
	const { mutate, isLoading: isCreatingOrder } =
		trpc.ecoProjects.create.useMutation({
			onSuccess() {
				router.push("/eco-projects");
				toast.success("Project created successfully.");
			}
		});

	const { data: ecoLocations, isLoading: fetchingEcoLocations } =
		trpc.ecoLocations.getAll.useInfiniteQuery(
			{},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor
			}
		);

	const { data: users, isLoading: fetchingUsers } =
		trpc.users.getAll.useInfiniteQuery(
			{
				role: ["Producer", "Verifier"]
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor
			}
		);

	const cachedLocations = useMemo(
		() => ecoLocations?.pages.flatMap((page) => page.locations),
		[ecoLocations]
	);

	const cachedUsers = useMemo(
		() => users?.pages.flatMap((page) => page.users),
		[users]
	);

	const producerUsers = useMemo(
		() => cachedUsers?.filter((user) => user.role.role === "Producer"),
		[cachedUsers]
	);

	const verifierUsers = useMemo(
		() => cachedUsers?.filter((user) => user.role.role === "Verifier"),
		[cachedUsers]
	);

	const form = useZodForm({
		schema: createEcoProjectSchema.omit({
			siteID: true
		})
	});
	{
		/* <div className="flex w-full flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
				<DefaultCard
					className="flex flex-col space-y-4"
					size="half"
				></DefaultCard>
				<DefaultCard
					className="flex flex-col space-y-4"
					size="half"
				></DefaultCard>
			</div> */
	}

	return (
		<div className="w-full space-y-4">
			<DefaultCard className="flex flex-col space-y-4" size="half">
				<div className="flex space-x-2">
					<Link href="/admin-users" className="inline-block">
						<FontAwesomeIcon
							icon={faArrowLeft}
							size="lg"
							className="mt-1.5 text-slate-400"
						/>
					</Link>
					<div>
						<CardTitle>Create Project</CardTitle>
						<CardDescription>
							Create an eco project.
						</CardDescription>
					</div>
				</div>
				<Form
					form={form}
					onSubmit={(project) => {}}
					className="flex w-fit flex-col gap-4"
				>
					<FormInput
						label="Short Title"
						size="xl"
						wrapperClass="w-fit"
						{...form.register("shortTitle")}
					/>
					<FormSelect
						label="Project Type"
						size="xl"
						wrapperClass="w-fit"
						{...form.register("ecoType")}
					>
						{createEcoProjectSchema.shape.ecoType.options?.map(
							(type) => (
								<option key={type} value={type}>
									{transformEnum(type)}
								</option>
							)
						)}
					</FormSelect>
					<FormSelect
						label="Project Status"
						size="xl"
						wrapperClass="w-fit"
						{...form.register("status")}
					>
						{createEcoProjectSchema.shape.status.options?.map(
							(type) => (
								<option key={type} value={type}>
									{transformEnum(type)}
								</option>
							)
						)}
					</FormSelect>
					<FormSelect
						label="Location"
						size="xl"
						wrapperClass="w-fit"
						defaultValue=""
						{...form.register("locationID")}
					>
						<option value="" hidden></option>
						{cachedLocations?.map((location) => (
							<option
								key={location.locationID}
								value={location.locationID}
							>
								{`${location.location}, 
								${State.getStateByCodeAndCountry(location.st, location.cn)?.name}, 
                                ${Country.getCountryByCode(location.cn)?.name}`}
							</option>
						))}
					</FormSelect>
					<FormSelect
						label="Verifier"
						size="xl"
						wrapperClass="w-fit"
						defaultValue=""
						{...form.register("vfyUserID")}
					>
						<option value="" hidden></option>
						{verifierUsers?.map((user) => (
							<option key={user.userID} value={user.userID}>
								{user.username}
								{" - "}
								{user.email}
							</option>
						))}
					</FormSelect>
					<FormSelect
						label="Producer"
						size="xl"
						wrapperClass="w-fit"
						defaultValue=""
						{...form.register("prdUserID")}
					>
						<option value="" hidden></option>
						{producerUsers?.map((user) => (
							<option key={user.userID} value={user.userID}>
								{user.username}
								{" - "}
								{user.email}
							</option>
						))}
					</FormSelect>
					<FormInput
						label="Eco URL"
						size="xl"
						wrapperClass="w-fit"
						{...form.register("ecoUrl")}
					/>
					<FormInput
						name="List Image"
						label="List Image"
						size="full"
						type="file"
					/>
					<FormInput
						name="1st Head Image"
						label="1st Head Image"
						size="full"
						type="file"
					/>
					<FormInput
						name="2nd Head Image"
						label="2nd Head Image"
						size="full"
						type="file"
					/>
					<FormInput
						name="3rd Head Image"
						label="3rd Head Image"
						size="full"
						type="file"
					/>
					<FormTextArea
						label="Intro"
						width="xl"
						height="md"
						wrapperClass="w-fit"
						{...form.register("intro")}
					/>
					<FormTextArea
						label="Project"
						width="2xl"
						height="md"
						wrapperClass="w-fit"
						{...form.register("project")}
					/>
					<FormTextArea
						label="Overview"
						width="xl"
						wrapperClass="w-fit"
						{...form.register("project")}
					/>
					<Button fullWidth>Create Project</Button>
				</Form>
			</DefaultCard>
		</div>
	);
};

export default CreateEcoProject;
