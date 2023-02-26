import Button from "@ecotoken/ui/components/Button";
import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { useRouter } from "next/router";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";
import type { EcoOrder } from "@ecotoken/db";

const EcoProjectsList = () => {
	const router = useRouter();

	const { data: orders } = trpc.ecoProjects.getAll.useInfiniteQuery(
		{},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const columnHelper = createColumnHelper<EcoOrder>();
	const columns = [
		columnHelper.accessor("projectID", {
			header: "Project ID",
			id: "id"
		}),
		columnHelper.accessor("createdAt", {
			header: "Created At",
			cell: (info) => <>{info.renderValue()?.toDateString()}</>
		})
	];

	return (
		<div>
			<DefaultCard className="space-y-4">
				<div className="flex w-full">
					<div>
						<CardTitle>Eco Projects</CardTitle>
						<CardDescription>
							A list of all available eco projects.
						</CardDescription>
					</div>
					<div className="flex flex-1 items-end justify-end space-x-2">
						<Button
							onClick={async () =>
								await router.push(`${router.asPath}/create`)
							}
						>
							Create a project
						</Button>
					</div>
				</div>
				<Table
					data={orders?.pages[0]?.projects ?? []}
					columns={columns}
					fullWidth
				/>
			</DefaultCard>
		</div>
	);
};

export default EcoProjectsList;
