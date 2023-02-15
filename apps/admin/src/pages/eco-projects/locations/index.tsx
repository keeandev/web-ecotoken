import Button from "@ecotoken/ui/components/Button";
import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { useRouter } from "next/router";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";
import { EcoLocation } from "@ecotoken/db";

export const EcoLocations: React.FC = () => {
	const router = useRouter();
	const columnHelper = createColumnHelper<EcoLocation>();

	const { data } = trpc.ecoLocations.getAll.useInfiniteQuery(
		{},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const columns = [
		columnHelper.accessor("locationID", {
			header: "Location ID",
			id: "id"
		}),
		columnHelper.accessor("areaID", {
			header: "Area ID"
		}),
		columnHelper.accessor("location", {
			header: "Location"
		}),
		columnHelper.accessor("cn", {
			header: "Country"
		}),
		columnHelper.accessor("st", {
			header: "Province/State"
		}),
		columnHelper.accessor("updatedAt", {
			header: "Updated At",
			cell: (info) => <>{info.renderValue()?.toDateString()}</>
		})
	];

	return (
		<div>
			<DefaultCard className="space-y-4">
				<div className="flex w-full">
					<div>
						<CardTitle>Locations</CardTitle>
						<CardDescription>
							A list of all available locations.
						</CardDescription>
					</div>
					<div className="flex flex-1 items-end justify-end space-x-2">
						<Button
							onClick={() =>
								router.push(`${router.asPath}/create`)
							}
						>
							Add location
						</Button>
					</div>
				</div>
				<Table
					data={data?.pages[0]?.locations ?? []}
					columns={columns}
					fullWidth
				/>
			</DefaultCard>
		</div>
	);
};

export default EcoLocations;
