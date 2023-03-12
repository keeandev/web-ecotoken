import { trpc } from "@/utils/trpc";
import { createEcoOrderSchema } from "@ecotoken/api/src/schema/order";
import Button from "@ecotoken/ui/components/Button";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";
import { useMemo } from "react";
import { type z } from "zod";

const omittedSchema = createEcoOrderSchema.omit({
    userWallet: true,
    payAmount: true,
    payFee: true,
    payHash: true,
});

const OrderModal: React.FC<{
    onOrder: (order: z.infer<typeof omittedSchema>) => void;
    creditType?: string;
    loading?: boolean;
    admin?: boolean;
}> = ({ onOrder, creditType, loading, admin }) => {
    const { data: ecoProjects, isLoading: fetchingEcoProjects } =
        trpc.nftSeries.getAll.useInfiniteQuery(
            {
                isActive: true
            },
            {
                enabled: !!admin,
            },
        );

    const { data: users, isLoading: fetchingUsers } =
        trpc.users.getAll.useInfiniteQuery(
            {
                role: "Producer",
            },
            {
                enabled: !!admin,
            },
        );

    const cachedSeries = useMemo(
        () => ecoProjects?.pages.flatMap((page) => page.series),
        [ecoProjects],
    );

    const cachedUsers = useMemo(
        () => users?.pages.flatMap((page) => page.users),
        [users],
    );

    const form = useZodForm({
        schema: omittedSchema,
    });

    return (
        <Form
            form={form}
            onSubmit={(data) => onOrder(data)}
            className="space-y-4"
        >
            <div className="space-y-4">
                {admin && (
                    <>
                        <FormSelect
                            label="Project"
                            size="full"
                            defaultValue=""
                            {...form.register("nftSeriesID")}
                        >
                            <option value="" hidden></option>
                            {cachedSeries?.map((series) => (
                                <option
                                    key={series.nftSeriesID}
                                    value={series.nftSeriesID}
                                >
                                    {series.ecoTitle}
                                </option>
                            ))}
                        </FormSelect>
                        <FormSelect
                            label="User"
                            size="full"
                            defaultValue=""
                            {...form.register("userID")}
                        >
                            <option value="" hidden></option>
                            {cachedUsers?.map((user) => (
                                <option key={user.userID} value={user.userID}>
                                    {user.username} - {user.email}
                                </option>
                            ))}
                        </FormSelect>
                    </>
                )}
                <FormInput
                    label={creditType ? `Credits (${creditType})` : "Credits"}
                    type="number"
                    size="full"
                    defaultValue={100}
                    {...form.register("creditsPurchased", {
                        valueAsNumber: true,
                    })}
                />
                <FormSelect
                    label="Currency"
                    size="full"
                    {...form.register("currency")}
                >
                    {createEcoOrderSchema.shape.currency.options.map((type) => (
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
                <Button
                    loading={loading || fetchingEcoProjects || fetchingUsers}
                    fullWidth
                >
                    Purchase Credits
                </Button>
            </div>
        </Form>
    );
};

export default OrderModal;
