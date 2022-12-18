import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Table from "@ecotoken/ui/components/Table";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable
} from "@tanstack/react-table";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/Table",
	component: Table
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Table>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

type Person = {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	status: string;
	progress: number;
};

const defaultData: Person[] = [
	{
		firstName: "Tanner",
		lastName: "Linsley",
		age: 24,
		visits: 100,
		status: "In Relationship",
		progress: 50
	},
	{
		firstName: "tandy",
		lastName: "miller",
		age: 40,
		visits: 40,
		status: "Single",
		progress: 80
	},
	{
		firstName: "joe",
		lastName: "dirte",
		age: 45,
		visits: 20,
		status: "Complicated",
		progress: 10
	}
];
const columnHelper = createColumnHelper<Person>();

const columns = [
	columnHelper.accessor("firstName", {
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id
	}),
	columnHelper.accessor((row) => row.lastName, {
		id: "lastName",
		cell: (info) => <div className="text-right">{info.getValue()}</div>,
		header: () => <div className="text-right">Last Name</div>,
		footer: (info) => info.column.id
	}),
	columnHelper.accessor("age", {
		header: () => <div className="text-right">Age</div>,
		cell: (info) => <div className="text-right">{info.renderValue()}</div>,
		footer: (info) => info.column.id
	}),
	columnHelper.accessor("visits", {
		header: () => <span>Visits</span>,
		footer: (info) => info.column.id
	}),
	columnHelper.accessor("status", {
		header: "Status",
		footer: (info) => info.column.id
	}),
	columnHelper.accessor("progress", {
		header: "Profile Progress",
		footer: (info) => info.column.id
	})
];

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	intent: "primary",
	children: "Primary",
	head: "primary",
	tableHeader: "primary",
	tableRow: "primary",
	tableCell: "primary",
	text: "left",
	alternate: true,
	data: defaultData,
	columns
};
