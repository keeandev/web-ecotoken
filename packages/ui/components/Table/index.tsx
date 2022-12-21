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
				"px-3 py-2 whitespace-nowrap font-semibold text-sm border text-left border-slate-200 border-r-0 border-l-0 border-b-2"
		},
		body: {
			primary: ""
		},
		tableCell: {
			primary:
				"whitespace-nowrap px-3 py-2 font-light text-sm whitespace-nowrap overflow-hidden text-ellipsis"
		},
		tableRow: {
			primary: "hover:bg-slate-200/75"
		},
		fixed: {
			true: "table-fixed"
		},
		fullWidth: {
			true: "w-full"
		},
		alternate: {
			true: "odd:bg-slate-50 even:bg-slate-100",
			false: "border  border-slate-200 border-r-0 border-l-0"
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
		search?: boolean;
		showEntries?: boolean;
		limit?: number;
	};
const Table: React.FC<TableProps> = ({
	intent = "primary",
	head = "primary",
	tableHeader = "primary",
	body = "primary",
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
	limit = 10,
	search,
	showEntries,
	...props
}) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getRoleModel ?? getCoreRowModel()
	});

	return (
		<div>
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
		</div>
	);
};

export default Table;
