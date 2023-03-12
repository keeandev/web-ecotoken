import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Input from "@ecotoken/ui/components/Input";

const StakeProject = () => {
    const router = useRouter();
    if (router.query.id) {
        const { data } = trpc.ecoProjects.get.useQuery({
            identifier: router.query.id as string,
        });
        if (!data) return <div>Loading...</div>;

        return (
            <div className="flex w-full flex-col gap-8">
                {/* <div className="text-2xl font-medium">{data.title}</div>
                <div>{data.outcome}</div> */}
                <div className="flex w-full flex-col space-y-2">
                    <div className="relative h-64 w-full">
                        <Image
                            src={
                                data.headImage?.startsWith("https")
                                    ? data.headImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/${data.headImage}`
                            }
                            priority
                            alt="EcoProject head 1"
                            className="w-full rounded-md object-cover"
                            fill
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-2xl font-semibold">
                            {data.title}
                        </div>
                        <div>{data.intro}</div>
                    </div>
                </div>
                <div className="h-fit flex-1 rounded-md">
                    <div className="text-lg font-semibold">Stake</div>
                    <Input />
                </div>
            </div>
        );
    } else {
        return <div>Project not found.</div>;
    }
};

export default StakeProject;
