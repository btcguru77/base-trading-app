"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Selection,
  SortDescriptor,
  Link,
} from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { columns } from "@/props/data";
import Sidebar from "./components/Sidebar";
import { txProps } from "@/props/types";
import { getTokenAmount, getTxHistory } from "@/lib/api";
import Trading from "./components/Trading";
import { useAccount } from "wagmi";

const INITIAL_VISIBLE_COLUMNS = [
  "timestamp",
  "blocknum",
  "type",
  "asset",
  "amount",
  "tx",
];


export default function Dashboard() {
  const [tokenAddr, setTokenAddr] = useState<string>('');
  const [txs, setTxs] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const account = useAccount();

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...txs];

    return filteredUsers;
  }, [txs, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: txProps, b: txProps) => {
      const first = a[sortDescriptor.column as keyof txProps] as number;
      const second = b[sortDescriptor.column as keyof txProps] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((tx: txProps, columnKey: React.Key) => {
    const cellValue = tx[columnKey as keyof txProps];
    switch (columnKey) {
      // case "date":
      //   return <div>{tx.date}</div>;
      case "type":
        return (
          <div>
            {tx.type === 0 && "Buy"}
            {tx.type === 1 && "Sell"}
          </div>
        );
      case "tx":
        return (
          <Link href={`https://basescan.org/tx/${tx.tx}`} target="_blink">
            <FaEdit />
          </Link>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const getTokenHistory = async () => {
    const txHis = await getTxHistory(tokenAddr, account.address!);
    setTxs(txHis);
    setLoading(false);
  }
  
  useEffect(() => {
    const currentPage = location.pathname;
    setTokenAddr(currentPage.split('/')[2])
  }, [])

  useEffect(() => {
    if (tokenAddr !== "") {
      if (account.address) {
        getTokenHistory()        
      }
    }
  }, [tokenAddr, account.address])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {txs.length} txs
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent text-default-400 text-small outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    txs.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex justify-between items-center px-2 py-2">
        <span className="w-[30%] text-default-400 text-small">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="sm:flex justify-end gap-2 hidden w-[30%]">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div className="flex gap-5 p-5">
      <div className="w-full">
        
        <div>
          <Table
            aria-label="Table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="single"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody isLoading={isLoading} loadingContent="Loading..." emptyContent={"No txs found"} items={sortedItems}>
              {(item: any) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <Sidebar></Sidebar>
      </div>
    </div>
  );
}