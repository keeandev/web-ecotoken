import NFTBuilderPreview from "@/components/nft-builder-preview";
import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Button from "@ecotoken/ui/components/Button";
import { createNFTSchema } from "@ecotoken/api/src/schema/nft-builder";
import React, { ChangeEvent, useState, useRef } from "react";
import { trpc } from "@/utils/trpc";
import html2canvas from "html2canvas";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";

const NFTBuilder = () => {
	const form = useZodForm({
		schema: createNFTSchema.omit({
			image: true,
			id: true
		})
	});
	const { isLoading, mutate } = trpc.nftBuilder.mint.useMutation();

	const [imageBlob, setImageBlob] = useState<string>();
	const componentRef = useRef<HTMLDivElement | null>(null);

	const credits = form.watch("credits");
	const symbol = form.watch("symbol");
	const project = form.watch("project");
	const location = form.watch("location");
	const producer = form.watch("producer");
	const date = form.watch("date");

	const handleImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files[0]) {
			setImageBlob(URL.createObjectURL(files[0]));
		}
	};

	return (
		<div className="h-full w-full">
			<DefaultCard className="flex flex-col space-y-8" size="half">
				<div>
					<CardTitle>NFT Builder</CardTitle>
					<CardDescription>
						Construct an NFT based on some attributes.
					</CardDescription>
				</div>
				<div className="flex space-x-8">
					<div className="flex flex-1 flex-col space-y-4">
						<Form
							form={form}
							onSubmit={async (data) => {
								if (componentRef.current) {
									const canvas = await html2canvas(
										componentRef.current
									);
									document.body.appendChild(canvas);
									await mutate({
										...data,
										image: canvas.toDataURL(),
										id: "999"
									});
								}
							}}
							className="flex w-full flex-col gap-4"
						>
							<FormInput
								name="Image"
								label="Image"
								type="file"
								onChange={handleImageLoad}
								size="full"
							/>
							<FormInput
								label="Credits"
								type="number"
								defaultValue={1}
								min={1}
								{...form.register("credits", {
									setValueAs: (value) =>
										isNaN(value) ? 0 : parseInt(value)
								})}
								size="full"
							/>
							<FormInput
								label="Symbol"
								size="full"
								{...form.register("symbol")}
							/>
							<FormInput
								label="Project"
								size="full"
								{...form.register("project")}
							/>
							<FormInput
								label="Location"
								size="full"
								{...form.register("location")}
							/>
							<FormInput
								label="Producer"
								size="full"
								{...form.register("producer")}
							/>
							<FormInput
								label="Date"
								type="date"
								size="full"
								{...form.register("date", {
									valueAsDate: true
								})}
							/>
							<Button loading={isLoading} fullWidth>
								Build
							</Button>
						</Form>
					</div>
					<div className="relative flex flex-1 flex-col overflow-hidden rounded-lg">
						<NFTBuilderPreview
							ref={componentRef}
							image={imageBlob?.toString()}
							id={"999"}
							credits={credits}
							symbol={symbol}
							project={project}
							location={location}
							producer={producer}
							date={date}
							width={1200}
							height={1200}
						/>
						{/* {imageBlob && <Image src={imageBlob} alt="preview" fill />} */}
					</div>
				</div>
			</DefaultCard>
		</div>
	);
};

export default NFTBuilder;
