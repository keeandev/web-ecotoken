/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { useRouter } from "next/router";
import { Tab, TabList, Tabs } from "react-tabs";

const ProjectTabPanelForCreate = ({
    children,
    index,
}: {
    children: React.ReactNode;
    index: number;
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
                                void router.push("/eco-projects");
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
                                void router.push(`/eco-projects/create`);
                            }}
                        >
                            Summary
                        </Tab>
                    )}
                </TabList>
                <div className="w-full">{children}</div>
            </Tabs>
        </>
    );
};

export default ProjectTabPanelForCreate;
