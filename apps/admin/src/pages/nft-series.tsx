import Button from "@ecotoken/ui/components/Button";
import Form, {
	FormInput,
	FormSelect,
	useZodForm
} from "@ecotoken/ui/components/Form";
import { createNFTSeriesSchema } from "@ecotoken/api/src/schema/nft-series";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";
import { transformEnum } from "@/utils/transformer";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { toast } from "react-hot-toast";

const NFTSeries: React.FC = () => {
	const form = useZodForm({
		schema: createNFTSeriesSchema.omit({
			seriesImage: true
		})
	});

	const { mutate, isLoading: isCreating } = trpc.nftSeries.create.useMutation(
		{
			onSuccess() {
				toast.success("NFT Series created successfully.");
			},
            onError() {
                toast.error("NFT Series failed to create.");
            }
		}
	);
	const { data: ecoProjects, isLoading: fetchingEcoProjects } =
		trpc.ecoProjects.getAll.useInfiniteQuery(
			{},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor
			}
		);

	const { data: users, isLoading: fetchingUsers } =
		trpc.users.getAll.useInfiniteQuery(
			{
				role: "Producer"
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor
			}
		);

	const cachedProjects = useMemo(
		() => ecoProjects?.pages.flatMap((page) => page.projects),
		[ecoProjects]
	);

	const cachedUsers = useMemo(
		() => users?.pages.flatMap((page) => page.users),
		[users]
	);

	return (
		<div className="space-y-4">
			<div>
				<CardTitle>NFT Series</CardTitle>
				<CardDescription>Create a NFT series.</CardDescription>
			</div>
			<Form
				form={form}
				onSubmit={async (data) => {
					await mutate({
						...data,
						seriesImage: "https://google.com"
					});
				}}
				className="flex w-full flex-col gap-4"
			>
				<FormInput
					name="Series Image"
					label="Series Image"
					size="full"
					type="file"
				/>
				<FormSelect
					label="Project"
					size="full"
					defaultValue=""
					{...form.register("projectID")}
				>
					<option value="" hidden></option>
					{cachedProjects?.map((project) => (
						<option
							key={project.projectID}
							value={project.projectID}
						>
							{project.ecoTitle}
						</option>
					))}
				</FormSelect>
				<FormSelect
					label="Series Type"
					{...form.register("seriesType")}
					size="full"
				>
					{createNFTSeriesSchema.shape.seriesType.options?.map(
						(type) => (
							<option key={type} value={type}>
								{transformEnum(type)}
							</option>
						)
					)}
				</FormSelect>
				<FormInput
					label="Series Name"
					size="full"
					{...form.register("seriesName")}
				/>
				<FormInput
					label="Series Number"
					type="number"
					size="full"
					defaultValue={1}
					{...form.register("seriesNumber", {
						valueAsNumber: true
					})}
				/>
				{/* <FormInput
				label="Producer"
				size="full"
				{...form.register("producerID")}
			/> */}
				<FormSelect
					label="Producer"
					size="full"
					defaultValue=""
					{...form.register("producerID")}
				>
					<option value="" hidden></option>
					{cachedUsers?.map((user) => (
						<option key={user.userID} value={user.userID}>
							{user.companyName}
						</option>
					))}
				</FormSelect>
				<FormInput
					label="Producer Wallet Address"
					size="full"
					{...form.register("producerWallet")}
				/>
				<FormInput
					label="Recieving Wallet Address"
					size="full"
					{...form.register("recieveWallet")}
				/>
				<FormInput
					label="Credit Wallet Address"
					size="full"
					{...form.register("creditWallet")}
				/>
				<FormInput
					label="Credit Wallet Private Key"
					size="full"
					{...form.register("creditKey")}
				/>
				<Button
					loading={fetchingEcoProjects || fetchingUsers || isCreating}
					fullWidth
				>
					Create
				</Button>
			</Form>
		</div>
	);
};

export default NFTSeries;
