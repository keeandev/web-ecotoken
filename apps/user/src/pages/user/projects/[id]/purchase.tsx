import React from "react";
import { useRouter } from "next/router";
import DefaultCard, {
	CardTitle,
	CardDescription
} from "@ecotoken/ui/components/Card";
import Image from "next/image";
import Form, {
	FormInput,
	useZodForm,
	FormSelect
} from "@ecotoken/ui/components/Form";
import Button from "@ecotoken/ui/components/Button";
import { createEcoOrderSchema } from "@ecotoken/api/src/schema/order";
import { trpc } from "@/utils/trpc";

const omittedSchema = createEcoOrderSchema.omit({
	userWallet: true,
	payAmount: true,
	payFee: true,
	payHash: true,
	nftID: true
});

const PurchaseProject = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data: project } = trpc.ecoProjects.get.useQuery({
		url: id as string
	});

	const { data: price } = trpc.coinPrice.get.useQuery({});

	const [creditType, setCreditType] = React.useState("RH20");
	const [currency, setCurrency] = React.useState("SOL");

	const [credits, setCredits] = React.useState(100);

	const form = useZodForm({
		schema: omittedSchema
	});

	if (!project || !project.projectID || !price) return <>Loading...</>;

	return (
		<div className="mx-2 mt-6 w-full">
			<DefaultCard size="full">
				<CardTitle className="text-center">
					{project.ecoTitle}
				</CardTitle>
				<div className="mt-10 grid w-full grid-cols-2 px-2 py-5">
					<div className="w-full">
						<Form
							className="space-y-4"
							method="post"
							action=""
							form={form}
							onSubmit={(data) => {
								console.log(data);
							}}
						>
							<FormInput
								className="mt-3"
								label={
									creditType
										? `Credits (${creditType})`
										: "Credits"
								}
								type="number"
								size="full"
								defaultValue={100}
								{...form.register("creditAmount", {
									valueAsNumber: true
								})}
								onChange={(e) => {
									setCredits(Number(e.target.value));
								}}
							/>
							<FormSelect
								label="Currency"
								className="mt-3"
								size="full"
								{...form.register("payType")}
								onChange={(e) => {
									setCurrency(e.target.value);
								}}
							>
								{createEcoOrderSchema.shape.payType.options.map(
									(type) => (
										<option key={type} value={type}>
											{type}
										</option>
									)
								)}
							</FormSelect>
							<p className="py-5">
								Purchase Price:{" "}
								{Number(
									(credits * 1.5) /
										(currency === "SOL"
											? price.data.solana.usd
											: 1)
								).toFixed(2)}
							</p>
							<FormInput
								size="full"
								label="Retired By"
								className="mt-3"
								{...form.register("retireBy")}
							/>
							<FormInput
								className="mt-3"
								size="full"
								label="Your Location"
								{...form.register("userLocation")}
							/>
							<Button className="mt-4" fullWidth type="submit">
								Purchase Credits
							</Button>
						</Form>
					</div>
					<div className="w-full px-5">
						<Image
							src={`/images/${
								JSON.parse(project.images).listImage
							}`}
							alt="EcoProject thumbnail image"
							className=" h-60 min-h-[300px] w-full rounded-md object-cover"
							width={300}
							height={200}
						/>
					</div>
				</div>
			</DefaultCard>
		</div>
	);
};

export default PurchaseProject;
