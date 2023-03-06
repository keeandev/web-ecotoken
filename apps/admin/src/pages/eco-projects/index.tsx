import Button from "@ecotoken/ui/components/Button";
import DefaultCard, {
    CardDescription,
    CardTitle,
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { useRouter } from "next/router";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";
import { transformEnum } from "@/utils/transformer";

type Unarrayify<T> = T extends Array<infer E> ? E : T;

const EcoProjectsList = () => {
    const router = useRouter();

    const { data } = trpc.ecoProjects.getAll.useInfiniteQuery({});
    const projects = data?.pages.flatMap((data) => data.projects);
    type Project = NonNullable<Unarrayify<typeof projects>>;

    const columnHelper = createColumnHelper<Project>();
    const columns = [
        columnHelper.accessor("projectID", {
            header: "Project ID",
            id: "id",
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => transformEnum(info.getValue()),
        }),
        columnHelper.accessor("shortTitle", {
            header: "Short Title",
        }),
        columnHelper.accessor("fundAmount", {
            header: "Fund Amount",
        }),
        columnHelper.accessor("fundRecieved", {
            header: "Fund Recieved",
        }),
        columnHelper.accessor("ecoType", {
            header: "Project Type",
            cell: (info) => transformEnum(info.getValue()),
        }),
        columnHelper.accessor("createdAt", {
            header: "Created At",
            cell: (info) => info.renderValue()?.toDateString(),
        }),
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
                <Table data={projects ?? []} columns={columns} fullWidth />
            </DefaultCard>
        </div>
    );
};

export default EcoProjectsList;
