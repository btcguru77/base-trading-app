"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { tokenColumns, statusOptions, tokenAddrs } from "@/props/data";
import { capitalize } from "@/props/utils";
import { getTokenInfo } from "./lib/api";
import { tokenProps } from "./props/types";

// Map status to corresponding Chip color
const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

// Default visible columns
const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "price",
  "volumeH6",
  "volume",
  "priceChangeH6",
  "fdv",
  "website",
  "twitter",
  "telegram",
  "discord",
];

export default function Home() {
  const router = useRouter();

  // State variables
  const [tokens, setTokens] = useState<tokenProps[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);

  // Search filter flag
  const hasSearchFilter = Boolean(filterValue);

  // Dynamically generate header columns based on visible columns
  const headerColumns = useMemo(() => {
    return visibleColumns === "all"
      ? tokenColumns
      : tokenColumns.filter((column) =>
          Array.from(visibleColumns).includes(column.uid)
        );
  }, [visibleColumns]);

  // Filter and sort tokens based on search, status filter, and sorting rules
  const filteredItems = useMemo(() => {
    let filteredTokens = [...tokens];

    if (hasSearchFilter) {
      filteredTokens = filteredTokens.filter((tx) =>
        tx.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredTokens = filteredTokens.filter((tx: any) =>
        Array.from(statusFilter).includes(tx.makers)
      );
    }

    return filteredTokens;
  }, [tokens, filterValue, statusFilter]);

  // Pagination
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  // Sort tokens based on selected column
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof tokenProps] as number;
      const second = b[sortDescriptor.column as keyof tokenProps] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Render cell based on column
  const renderCell = useCallback((tx: tokenProps, columnKey: React.Key) => {
    const cellValue = tx[columnKey as keyof tokenProps];
    return cellValue;
  }, []);

  // Pagination handlers
  const onNextPage = useCallback(() => {
    if (page < pages) setPage(page + 1);
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  // Search filter handler
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Top content for filtering and columns visibility
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by token name..."
            startContent={<FaSearch />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="sm:flex hidden">
                <Button endContent={<FaChevronDown />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="single"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid}>
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="sm:flex hidden">
                <Button endContent={<FaChevronDown />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="single"
                onSelectionChange={setVisibleColumns}
              >
                {tokenColumns.map((column) => (
                  <DropdownItem key={column.uid}>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {tokens.length} tokens
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, tokens.length]);

  // Bottom content for pagination and selection
  const bottomContent = useMemo(() => {
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
            isDisabled={page === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={page === pages}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  // Fetch token information from the API
  const getTokenInfos = async () => {
    const tokenArr: tokenProps[] = [];
    for (let i = 0; i < tokenAddrs.length; i++) {
      const tokenAddr = tokenAddrs[i];
      const token = await getTokenInfo(tokenAddr, i + 1);
      tokenArr.push(token);
    }
    setTokens(tokenArr);
    setLoading(false);
  };

  useEffect(() => {
    getTokenInfos();
  }, []);

  // Main table render
  return (
    <div className="p-5">
      <Table
        aria-label="Token table with pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
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
        <TableBody isLoading={isLoading} loadingContent="Loading..." emptyContent="No tokens found" items={sortedItems}>
          {(item) => (
            <TableRow
              key={item.id}
              onClick={() => router.push(`/token/${item.addr}`)}
              style={{ cursor: "pointer" }}
            >
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
