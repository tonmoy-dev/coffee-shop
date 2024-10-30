"use client";

import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "../ui/data-table-pagination";
import { useEffect, useState } from "react";
import { serverURL } from "@/utils/serverURL";
import { DailySalesDataProps } from "@/types/dataTypes";
import { useSellerStore } from "@/stores/useSellerStore";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { DateRange } from "react-day-picker";

function formattedDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Reports() {
  const seller = useSellerStore((state) => state.seller);

  const { data, error } = useSWR<DailySalesDataProps[]>(
    `${serverURL}/api/daily-sales/${seller?.email}`,
    fetcher
  );

  const tableData = data || [];
  const [salesFilteredData, setSalesFilteredData] =
    useState<DailySalesDataProps[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [date, setDate] = useState<Date>();
  const [summary, setSummary] = useState({
    grandTotalSales: 0,
    grandTotalAmount: 0,
    fromDate: "",
    toDate: ""
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined, // new Date(2024, 8, 10),
    to: undefined, // addDays(new Date(2024, 8, 30), 10),
  })

  // update data
  useEffect(() => {
    if (data) {
      setSalesFilteredData(data);
    }
  }, [data]);

  // Function to filter sales data by date range
  function filterSalesDataByDateRange(
    data: any[],
    dateRange: any
  ) {
    const { from, to } = dateRange;
    console.log(from, to);


    // Convert 'from' and 'to' dates to JavaScript Date objects
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Filter the data based on the date range
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= fromDate && itemDate <= toDate;
    });
    console.log(filteredData);

    // Calculate the total amount for the filtered data
    const totalAmount = filteredData.reduce(
      (sum, item) => sum + Number(item.total_amount),
      0
    );
    // Calculate the total amount for the filtered data
    const totalSales = filteredData.reduce(
      (sum, item) => sum + item.total_sales,
      0
    );

    setSummary({
      ...summary,
      grandTotalSales: totalSales,
      grandTotalAmount: totalAmount,
      fromDate: formattedDate(fromDate),
      toDate: formattedDate(toDate)
    })
    return filteredData;
  }



  // Filter the data when a new date is picked
  useEffect(() => {
    if (date !== undefined) {
      console.log("filtered by date");

      const pickedDate = new Date(date).toLocaleDateString();
      // Filtering data by date
      const filteredData = tableData?.filter(data => new Date(data?.date).toLocaleDateString() === pickedDate);

      setSalesFilteredData([...filteredData]);
    }
    if (dateRange?.from !== undefined && dateRange?.to !== undefined) {
      console.log("filtered by date range");

      const filteredSalesData = filterSalesDataByDateRange(tableData, dateRange);
      setSalesFilteredData([...filteredSalesData])
    }
  }, [date, dateRange, tableData]);




  // Define table columns
  const columns: ColumnDef<unknown, any>[] = [
    // -- check box --
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // -- date --
    {
      accessorKey: "date",
      header: () => <div className="font-semibold text-primary">Date</div>,
      cell: ({ row }) => {
        let pickedDate;
        if (date === undefined) {
          const utcDate: any = row.getValue("date");
          pickedDate = new Date(utcDate).toLocaleDateString();
        } else {
          pickedDate = new Date(date).toLocaleDateString();
        }
        return <div className="capitalize text-left">
          {/* {formattedate} */}
          {pickedDate}
        </div>;
      },
    },
    // -- Name --
    {
      accessorKey: "product_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="font-semibold text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-left ms-4">{row.getValue("product_name")}</div>
      ),
    },
    // -- Category --
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="font-semibold text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-left ms-4">{row.getValue("category")}</div>
      ),
    },

    //   -- Variant --
    {
      accessorKey: "product_variant",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="font-semibold text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Variant
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-left text-slate-700 dark:text-white Capitalize ms-4">
          {row.getValue("product_variant")}
        </div>
      ),
    },
    //   -- price --
    {
      accessorKey: "product_price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="font-semibold text-primary"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >Price <span className="uppercase ms-1">({seller?.currency})</span>
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-left ms-4 text-slate-700 dark:text-white">
          {row.getValue("product_price")}
        </div>
      ),
    },
    //   -- Total Sales --
    {
      accessorKey: "total_sales",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="font-semibold text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Sales
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-left text-slate-700 dark:text-white ms-4">
          {row.getValue("total_sales")}
        </div>
      ),
    },
    //   -- Total Amount --
    {
      accessorKey: "total_amount",
      header: () => (
        <div className="font-semibold text-primary">Total Amount <span className="uppercase">({seller?.currency})</span> </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"));
        return (
          <div className="text-left text-slate-700  dark:text-white ms-4">
            {amount}
          </div>
        );
      },
    },
  ];

  //   Implement tanstack table
  const table = useReactTable({
    data: salesFilteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (error) {
    return <p>Failed to load data.</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full border p-4 rounded-md">
      <div className="flex flex-col md:flex-row gap-6 items-left md:justify-between py-4 w-full">
        {/* -- Search by names -- */}
        <Input
          placeholder="Search by name"
          value={(table.getColumn("product_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("product_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* -- date picker -- */}
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        {/* -- column visibility -- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-muted-foreground">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        {/* -- Table with header & body -- */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* -- Table pagination -- */}
      <div className="py-4">
        <DataTablePagination table={table} />
      </div>
      <div>
        <div className="text-sm">
          {
            (dateRange?.from && dateRange?.to) ? (
              <>
                <span>
                  Date from {`${summary?.fromDate}`} to {`${summary?.toDate}`}
                </span>
                <span className="ms-3">Total Sales Calculated: {summary?.grandTotalSales},  </span>
                <span className="">Total Amount Calculated: {summary?.grandTotalAmount}</span>
                <span className="uppercase"> {seller?.currency}</span>
              </>
            ) : ""
          }
        </div>
      </div>
    </div>
  );
}
