import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Site } from "@ecotoken/db";
import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";

const Websites = () => {
	const router = useRouter();
	const columnHelper = createColumnHelper<Site>();

	const columns = [
		columnHelper.accessor("siteID", {
			header: "Site ID",
			id: "id"
		}),
		columnHelper.accessor("siteName", {
			header: "Site Name"
		}),
		columnHelper.accessor("prodUrl", {
			header: "Production URL"
		}),
		columnHelper.accessor("stageUrl", {
			header: "Staging URL"
		}),
		columnHelper.accessor("devUrl", {
			header: "Dev. URL"
		}),
		columnHelper.accessor("createdAt", {
			header: "Created At",
			cell: (info) => <>{info.renderValue()?.toDateString()}</>
		})
	];

	const { data } = trpc.websites.getAll.useInfiniteQuery({});

	return (
		<div>
			<DefaultCard className="space-y-4">
				<div className="flex w-full">
					<div>
						<CardTitle>Websites</CardTitle>
						<CardDescription>
							A list of all available websites.
						</CardDescription>
					</div>
					<div className="flex flex-1 items-end justify-end space-x-2">
						<Button
							onClick={() =>
								router.push(`${router.asPath}/create`)
							}
						>
							Add website
						</Button>
					</div>
				</div>
				<Table
					data={data?.pages[0]?.websites ?? []}
					columns={columns}
					fullWidth
				/>
			</DefaultCard>
		</div>
	);
};

export default Websites;
