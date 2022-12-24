import React, { Fragment } from "react";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import {
	type RowModel,
	type Table as TanstackTableType,
	flexRender,
	getCoreRowModel,
	useReactTable
} from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

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
				"whitespace-nowrap px-3 py-2 font-light text-sm overflow-hidden text-ellipsis"
		},
		tableRow: {
			primary: "hover:bg-slate-200/75"
		},
		fixed: {
			true: "table-fixed"
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
		fixed: false
	}
});

export type TableProps = VariantProps<typeof tableStyles> &
	React.ComponentProps<"table"> & {
		data: unknown[];
		columns: ColumnDef<any, any>[];
		getRoleModel?: (table: TanstackTableType<any>) => () => RowModel<any>;
		fullWidth?: boolean;
		search?: boolean;
		showEntries?: boolean;
		limit?: number;
		link?: false | "default" | "custom";
		linkHref?: string;
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
	fullWidth = false,
	link = "default",
	text = "left",
	getRoleModel,
	limit = 10,
	search,
	showEntries,
	linkHref = "",
	...props
}) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getRoleModel ?? getCoreRowModel()
	});
	const router = useRouter();

	return (
		<div
			className={clsx("overflow-x-scroll", {
				"w-full": fullWidth
			})}
		>
			<table
				className={tableStyles({
					intent,
					fixed,
					class: className + " w-full"
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
								<td key={cell.id}>
									{link ? (
										<Link
											href={`${router.asPath}/${row
												.getAllCells()
												.find(
													(cell) =>
														cell.id ===
														`${row.index}_id`
												)
												?.getValue()}/edit`}
											className={tableStyles({
												tableCell,
												class: "block w-full"
											})}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</Link>
									) : (
										<div
											className={tableStyles({
												tableCell,
												class: "block w-full"
											})}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</div>
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
