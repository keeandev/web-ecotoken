import Input from "@ecotoken/ui/components/Input";
import Button from "@ecotoken/ui/components/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWebsiteSchema } from "@ecotoken/api/src/schema/website";
import { z } from "zod";
import React from "react";
import clsx from "clsx";

export type CreateWebsiteType = z.infer<typeof createWebsiteSchema>;

export type WebsiteCreateFormProps = {
	onCreate?: (adminUser: CreateWebsiteType) => void;
	loading?: boolean;
};

const WebsiteCreateForm: React.FC<
	WebsiteCreateFormProps & React.ComponentProps<"form">
> = ({ onCreate, loading, className, ...props }) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateWebsiteType>({
		resolver: zodResolver(createWebsiteSchema),
		reValidateMode: "onChange"
	});

	const onSubmit: SubmitHandler<CreateWebsiteType> = (data) => {
		if (onCreate)
			onCreate({
				...data
			});
	};

	return (
		<form
			className={clsx("flex w-full flex-col gap-4", className)}
			onSubmit={handleSubmit(onSubmit)}
			{...props}
		>
			<div className="flex flex-col gap-4 md:flex-row">
				<Input
					label="Site Name"
					size="xl"
					error={errors.siteName?.message}
					{...register("siteName")}
				/>
				<Input
					label="Production URL"
					size="xl"
					error={errors.prodUrl?.message}
					{...register("prodUrl")}
				/>
			</div>
			<Button loading={loading} fullWidth>
				Create
			</Button>
		</form>
	);
};

export default WebsiteCreateForm;
