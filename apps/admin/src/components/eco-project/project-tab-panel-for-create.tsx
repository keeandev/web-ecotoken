import Router, { useRouter } from "next/router";

import { Tab, Tabs, TabList } from "react-tabs";
import Link from "next/link";

const ProjectTabPanelForCreate = ({
    children,
    index,
    projectId,
}: {
    children: any;
    index: number;
    projectId?: string;
}) => {
    const router = useRouter();
    return (
        <>
            <Tabs
                defaultIndex={index}
                onSelect={(index) => console.log(index)}
                className="flex w-full"
            >
                <TabList>
                    {index === 0 ? (
                        <Tab>Project List</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push("/eco-projects");
                            }}
                        >
                            Project List
                        </Tab>
                    )}
                    {index === 1 ? (
                        <Tab>Summary</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(`/eco-projects/create`);
                            }}
                        >
                            Summary
                        </Tab>
                    )}
                </TabList>
                <div className="w-full">{children}</div>
                {/* {[...Array(2).keys()].map((value) => {
                    console.log(value === index);
                    if (value === index) return <TabPanel>{children}</TabPanel>;
                    else {
                        <TabPanel>
                            <h5>123asdf</h5>
                        </TabPanel>;
                    }
                })} */}
            </Tabs>
        </>
    );
};

export default ProjectTabPanelForCreate;
