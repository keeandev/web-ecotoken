import NFTBuilderPreview from "@/components/nft-builder-preview";
import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Input from "@ecotoken/ui/components/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@ecotoken/ui/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNFTSchema } from "@ecotoken/api/src/schema/nft-builder";
import { z } from "zod";
import React, { ChangeEvent, useState, useRef } from "react";
import { trpc } from "@/utils/trpc";
import html2canvas from "html2canvas";

export type CreateNFTType = z.infer<typeof createNFTSchema>;

const NFTBuilder = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<CreateNFTType>({
		// resolver: zodResolver(createNFTSchema),
		reValidateMode: "onChange"
	});

	const { isLoading, mutate } = trpc.nftBuilder.mint.useMutation();

	const [imageBlob, setImageBlob] = useState<string>();
	const componentRef = useRef<HTMLDivElement | null>(null);

	const credits = watch("credits");
	const symbol = watch("symbol");
	const project = watch("project");
	const location = watch("location");
	const producer = watch("producer");
	const date = watch("date");

	const onSubmit: SubmitHandler<CreateNFTType> = async (data) => {
		console.log("mutedate");
		if (componentRef.current) {
			const canvas = await html2canvas(componentRef.current);
			document.body.appendChild(canvas);
			await mutate({
				...data,
				image: canvas.toDataURL(),
				id: "999"
			});
		}
	};

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
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex w-full flex-col gap-4"
						>
							<Input
								label="Image"
								type="file"
								{...register("image")}
								error={errors.image?.message}
								onChange={handleImageLoad}
								fullWidth
							/>
							<Input
								label="Credits"
								type="number"
								defaultValue={1}
								min={1}
								{...register("credits", {
									setValueAs: (value) =>
										isNaN(value) ? 0 : parseInt(value)
								})}
								error={errors.credits?.message}
								fullWidth
							/>
							<Input
								label="Symbol"
								{...register("symbol")}
								error={errors.symbol?.message}
								fullWidth
							/>
							<Input
								label="Project"
								{...register("project")}
								error={errors.project?.message}
								fullWidth
							/>
							<Input
								label="Location"
								{...register("location")}
								error={errors.location?.message}
								fullWidth
							/>
							<Input
								label="Producer"
								{...register("producer")}
								error={errors.producer?.message}
								fullWidth
							/>
							<Input
								label="Date"
								type="date"
								{...register("date", { valueAsDate: true })}
								error={errors.date?.message}
								fullWidth
							/>
							<Button fullWidth type="submit">
								Build
							</Button>
						</form>
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
