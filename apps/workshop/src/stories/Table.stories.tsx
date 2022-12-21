import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Table from "@ecotoken/ui/components/Table";
import { createColumnHelper } from "@tanstack/react-table";

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
	email: string;
};

const defaultData: Person[] = [
	{
		firstName: "Tanner",
		lastName: "Linsley",
		age: 24,
		visits: 100,
		status: "In Relationship",
		email: "tanner.linsley@gmail.com"
	},
	{
		firstName: "Tandy",
		lastName: "Miller",
		age: 40,
		visits: 40,
		status: "Single",
		email: "tandy.miller@gmail.com"
	},
	{
		firstName: "Joe",
		lastName: "Dirte",
		age: 45,
		visits: 20,
		status: "Complicated",
		email: "joe.dirte@gmail.com"
	}
];
const columnHelper = createColumnHelper<Person>();

const columns = [
	columnHelper.accessor("firstName", {
		cell: (info) => info.getValue(),
		header: "First Name",
		footer: (info) => info.column.id
	}),
	columnHelper.accessor((row) => row.lastName, {
		id: "lastName",
		cell: (info) => info.getValue(),
		header: () => "Last Name",
		footer: (info) => info.column.id
	}),
	columnHelper.accessor("age", {
		header: () => <div className="text-right">Age</div>,
		cell: (info) => <div className="text-right">{info.renderValue()}</div>,
		footer: (info) => info.column.id
	}),
	columnHelper.accessor("visits", {
		header: () => <div className="text-right">Visits</div>,
		cell: (info) => <div className="text-right">{info.renderValue()}</div>,
		footer: (info) => info.column.id
	}),
	columnHelper.accessor("status", {
		header: "Status",
		cell: (info) => <div className="italic">{info.renderValue()}</div>,
		footer: (info) => info.column.id
	}),
	columnHelper.accessor("email", {
		header: "Email",
		cell: (info) => (
			<a href={`mailto:${info.renderValue()}`} className="text-blue-900">
				{info.renderValue()}
			</a>
		),
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
	fullWidth: true,
	data: defaultData,
	columns
};
