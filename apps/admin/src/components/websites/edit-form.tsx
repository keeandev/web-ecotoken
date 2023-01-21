import Input from "@ecotoken/ui/components/Input";
import Button from "@ecotoken/ui/components/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createWebsiteSchema,
	updateWebsiteSchema
} from "@ecotoken/api/src/schema/website";
import { z } from "zod";
import React, { useEffect } from "react";
import clsx from "clsx";
import { Site } from "@ecotoken/db";

export type UpdateWebsiteType = z.infer<typeof updateWebsiteSchema>;

export type WebsiteEditFormProps = {
	site?: Site;
	reset?: UpdateWebsiteType;
	onSave?: (website: UpdateWebsiteType) => void;
	onDelete?: () => void;
	updating?: boolean;
	deleting?: boolean;
};

const EditWebsiteForm: React.FC<
	WebsiteEditFormProps & React.ComponentProps<"form">
> = ({
	onSave,
	onDelete,
	updating,
	deleting,
	reset,
	site,
	className,
	...props
}) => {
	const {
		register,
		handleSubmit,
		reset: formReset,
		formState: { errors }
	} = useForm<UpdateWebsiteType>({
		resolver: zodResolver(updateWebsiteSchema),
		reValidateMode: "onChange"
	});

	const onSubmit: SubmitHandler<UpdateWebsiteType> = (data) => {
		if (onSave) onSave(data);
	};

	useEffect(() => {
		formReset(reset);
	}, [site, formReset, reset]);

	return (
		<form
			className={clsx("flex w-full flex-col gap-4", className)}
			onSubmit={handleSubmit(onSubmit)}
			{...props}
		>
			<div className="flex flex-col gap-4">
				<Input
					label="Site Name"
					size="xl"
					error={errors.siteName?.message}
					fullWidth
					{...register("siteName")}
				/>
				<Input
					label="Legal Name"
					size="xl"
					error={errors.legalName?.message}
					fullWidth
					{...register("legalName")}
				/>
				<Input
					label="Mailing Address"
					size="xl"
					error={errors.mailAddress?.message}
					{...register("mailAddress")}
					fullWidth
				/>
				<Input
					label="Production URL"
					size="xl"
					error={errors.prodUrl?.message}
					fullWidth
					{...register("prodUrl")}
				/>
				<Input
					label="Staging URL"
					size="xl"
					error={errors.stageUrl?.message}
					fullWidth
					{...register("stageUrl")}
				/>
				<Input
					label="Development URL"
					size="xl"
					error={errors.devUrl?.message}
					fullWidth
					{...register("devUrl")}
				/>
			</div>
			<div className="w-full space-y-1.5">
				<Button loading={updating} fullWidth>
					Update
				</Button>
				<Button
					type="button"
					loading={deleting}
					intent="destructive"
					fullWidth
					onClick={() => {
						if (onDelete) onDelete();
					}}
				>
					Delete
				</Button>
			</div>
		</form>
	);
};

export default EditWebsiteForm;
