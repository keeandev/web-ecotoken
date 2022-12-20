import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	type RowModel,
	type Table as TanstackTableType,
	flexRender,
	getCoreRowModel,
	useReactTable
} from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

// Table styles are a work in progress, not 100% sure of the best way to style with variants for tables
const tableStyles = cva([], {
	variants: {
		intent: {
			primary: ""
		},
		head: {
			primary: ""
		},
		tableHeader: {
			primary:
				"bg-red-500 px-2 py-1 first:rounded-tl-md last:rounded-tr-md whitespace-nowrap"
		},
		body: {
			primary: ""
		},
		tableCell: {
			primary: "whitespace-nowrap px-2 py-1"
		},
		tableRow: {
			primary: ""
		},
		fixed: {
			true: "table-fixed"
		},
		fullWidth: {
			true: "w-full"
		},
		alternate: {
			true: "odd:bg-slate-200 even:bg-slate-300",
			false: "bg-slate-200"
		},
		text: {
			left: "text-left",
			right: "text-right",
			center: "text-center"
		}
	},
	defaultVariants: {
		fullWidth: false,
		fixed: false
	}
});

export type TableProps = VariantProps<typeof tableStyles> &
	React.ComponentProps<"table"> & {
		data: unknown[];
		columns: ColumnDef<any, any>[];
		getRoleModel?: (table: TanstackTableType<any>) => () => RowModel<any>;
	};
const Table: React.FC<TableProps> = ({
	intent = "primary",
	head,
	tableHeader = "primary",
	body,
	tableRow = "primary",
	tableCell = "primary",
	fixed,
	alternate,
	className,
	data,
	columns,
	fullWidth,
	text = "left",
	getRoleModel,
	...props
}) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getRoleModel ?? getCoreRowModel()
	});

	return (
		<table
			className={tableStyles({
				intent,
				fixed,
				fullWidth,
				class: className
			})}
			{...props}
		>
			<thead className={tableStyles({ head })}>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								key={header.id}
								className={tableStyles({ tableHeader })}
							>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext()
									  )}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody className={tableStyles({ body })}>
				{table.getRowModel().rows.map((row) => (
					<tr
						key={row.id}
						className={tableStyles({ tableRow, alternate })}
					>
						{row.getVisibleCells().map((cell) => (
							<td
								key={cell.id}
								className={tableStyles({
									tableCell
								})}
							>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
