import Button from "@ecotoken/ui/components/Button";
import Form, {
	FormInput,
	FormSelect,
	useZodForm
} from "@ecotoken/ui/components/Form";
import { createNFTSeriesSchema } from "@ecotoken/api/src/schema/nft-series";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";

const NFTSeries: React.FC = () => {
	const form = useZodForm({
		schema: createNFTSeriesSchema.omit({
			seriesImage: true,
            
		})
	});

	const { data: ecoProjects, isLoading: fetchingEcoProjects } =
		trpc.ecoProjects.getAll.useInfiniteQuery(
			{},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor
			}
		);

	const cachedProjects = useMemo(
		() => ecoProjects?.pages.flatMap((page) => page.projects),
		[ecoProjects]
	);

	return (
		<Form
			form={form}
			onSubmit={async (data) => {
				// if (role) await mutate({ ...data, roleID: role?.roleID });
			}}
			className="flex w-full flex-col gap-4"
		>
			<FormInput
				name="Series Image"
				label="Series Image"
				fullWidth
				type="file"
			/>
			<FormSelect
				label="Project"
				fullWidth
				defaultValue=""
				{...form.register("projectID")}
			>
				<option value="" hidden></option>
				{cachedProjects?.map((project) => (
					<option key={project.projectID} value={project.projectID}>
						{project.ecoTitle}
					</option>
				))}
			</FormSelect>
			<FormSelect
				label="Series Type"
				{...form.register("seriesType")}
				fullWidth
			>
				{createNFTSeriesSchema.shape.seriesType.options?.map((type) => (
					<option key={type} value={type}>
						{type}
					</option>
				))}
			</FormSelect>
			<FormInput
				label="Series Name"
				fullWidth
				{...form.register("seriesName")}
			/>
			<FormInput
				label="Series Number"
				type="number"
				fullWidth
				defaultValue={0}
				{...form.register("seriesNumber", {
					valueAsNumber: true
				})}
			/>
			<FormInput
				label="Recieving Wallet Address"
				fullWidth
				{...form.register("recieveWallet")}
			/>
			<FormInput
				label="Credit Wallet Address"
				fullWidth
				{...form.register("creditWallet")}
			/>
			<FormInput
				label="Producer Wallet Address"
				fullWidth
				{...form.register("producerWallet")}
			/>
			<FormInput
				label="Producer Name"
				fullWidth
				{...form.register("producerName")}
			/>
			<Button loading={fetchingEcoProjects} fullWidth>
				Create
			</Button>
		</Form>
	);
};

export default NFTSeries;
