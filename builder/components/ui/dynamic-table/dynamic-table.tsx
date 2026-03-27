import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "./dynamic-table.css";

// ============================================================================
// Types
// ============================================================================

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface SortState {
  key: string;
  direction: SortDirection;
}

interface DynamicTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  sortState?: SortState;
  onSort?: (sort: SortState) => void;
  isSelectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  onRowClick?: (row: T, index: number) => void;
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

// ============================================================================
// DynamicTable
// ============================================================================

function DynamicTable<T>({
  columns,
  rows,
  rowKey,
  sortState,
  onSort,
  isSelectable = false,
  selectedRows,
  onSelectionChange,
  onRowClick,
  page,
  rowsPerPage = 20,
  totalRows,
  onPageChange,
  isLoading = false,
  emptyMessage = "No data",
  className,
}: DynamicTableProps<T>) {
  const hasPagination =
    page !== undefined && totalRows !== undefined && onPageChange;
  const totalPages = hasPagination
    ? Math.ceil(totalRows / rowsPerPage)
    : 1;
  const allSelected =
    isSelectable && rows.length > 0 && selectedRows?.size === rows.length;

  const handleSort = (key: string) => {
    if (!onSort) return;
    if (sortState?.key === key) {
      const next: SortDirection =
        sortState.direction === "asc"
          ? "desc"
          : sortState.direction === "desc"
            ? null
            : "asc";
      onSort({ key, direction: next });
    } else {
      onSort({ key, direction: "asc" });
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      const all = new Set(rows.map((row, i) => rowKey(row, i)));
      onSelectionChange(all);
    }
  };

  const handleSelectRow = (key: string) => {
    if (!onSelectionChange || !selectedRows) return;
    const next = new Set(selectedRows);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    onSelectionChange(next);
  };

  const getSortIcon = (key: string) => {
    if (sortState?.key !== key || !sortState.direction) {
      return <ArrowUpDown className="size-3.5 opacity-40" />;
    }
    return sortState.direction === "asc" ? (
      <ArrowUp className="size-3.5" />
    ) : (
      <ArrowDown className="size-3.5" />
    );
  };

  return (
    <div data-slot="dynamic-table" className={cn(className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {isSelectable && (
              <TableHead style={{ width: 40 }}>
                <input
                  type="checkbox"
                  data-slot="dynamic-table-checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.sortable ? (
                  <button
                    data-slot="dynamic-table-sort"
                    onClick={() => handleSort(col.key)}
                    type="button"
                  >
                    {col.label}
                    {getSortIcon(col.key)}
                  </button>
                ) : (
                  col.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {isSelectable && (
                  <TableCell>
                    <div data-slot="dynamic-table-skeleton-cell" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <div data-slot="dynamic-table-skeleton-cell" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (isSelectable ? 1 : 0)}
              >
                <div data-slot="dynamic-table-empty">{emptyMessage}</div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => {
              const key = rowKey(row, index);
              const isSelected = selectedRows?.has(key);
              return (
                <TableRow
                  key={key}
                  data-state={isSelected ? "selected" : undefined}
                  data-clickable={onRowClick ? true : undefined}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {isSelectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        data-slot="dynamic-table-checkbox"
                        checked={isSelected || false}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(key);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row, index)
                        : String(
                            (row as Record<string, unknown>)[col.key] ?? "",
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {hasPagination && totalPages > 1 && (
        <div data-slot="dynamic-table-pagination">
          <span data-slot="dynamic-table-page-info">
            Page {page} of {totalPages}
          </span>
          <div data-slot="dynamic-table-page-buttons">
            <button
              type="button"
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
            >
              <ChevronsLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DynamicTable };
