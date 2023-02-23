import { createEcoOrderSchema } from "@ecotoken/api/src/schema/order";
import Button from "@ecotoken/ui/components/Button";
import Form, {
	FormInput,
	FormSelect,
	useZodForm
} from "@ecotoken/ui/components/Form";
import { z } from "zod";

const omittedSchema = createEcoOrderSchema.omit({
	userWallet: true,
	payAmount: true,
	payFee: true,
	payHash: true,
	nftID: true
});

const OrderModal: React.FC<{
	onOrder: (order: z.infer<typeof omittedSchema>) => void;
	creditType?: string;
    loading?: boolean;
}> = ({ onOrder, creditType, loading }) => {
	const form = useZodForm({
		schema: omittedSchema
	});

	return (
		<Form
			form={form}
			onSubmit={(data) => onOrder(data)}
			className="space-y-4"
		>
			<div className="space-y-4">
				<FormInput
					label={creditType ? `Credits (${creditType})` : "Credits"}
					type="number"
					size="full"
					defaultValue={100}
					{...form.register("creditAmount", {
						valueAsNumber: true
					})}
				/>
				<FormSelect
					label="Currency"
					size="full"
					{...form.register("payType")}
				>
					{createEcoOrderSchema.shape.payType.options?.map((type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</FormSelect>
				<FormInput
					size="full"
					label="Retired By"
					{...form.register("retireBy")}
				/>
				<FormInput
					size="full"
					label="Your Location"
					{...form.register("userLocation")}
				/>
				<Button loading={loading} fullWidth>Purchase Credits</Button>
			</div>
		</Form>
	);
};

export default OrderModal;
