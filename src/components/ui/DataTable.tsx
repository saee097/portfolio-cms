import { cn } from '@/lib/utils'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable, type OnChangeFn, type SortingState } from '@tanstack/react-table'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Button } from './Button'

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  pagination?: {
    pageIndex: number
    pageSize: number
    onPageChange: (pageIndex: number) => void
    onPageSizeChange: (pageSize: number) => void
    totalPages: number
    totalCount: number
  }
  sorting?: {
    sorting: SortingState
    onSortingChange: OnChangeFn<SortingState>
  }
  loading?: boolean
  emptyMessage?: string
  rowKey?: string | ((row: T) => string)
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns,
  data,
  pagination,
  sorting,
  loading = false,
  emptyMessage = 'No data available',
  rowKey = 'id',
  onRowClick,
}: DataTableProps<T>) {
  const getRowId = typeof rowKey === 'function' ? rowKey : (row: T) => String((row as Record<string, unknown>)[rowKey as string])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting?.sorting || [],
      pagination: pagination ? {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      } : undefined,
    },
    onSortingChange: sorting?.onSortingChange,
    onPaginationChange: pagination ? (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize })
        pagination.onPageChange(newState.pageIndex)
        pagination.onPageSizeChange(newState.pageSize)
      } else {
        pagination.onPageChange(updater.pageIndex)
        pagination.onPageSizeChange(updater.pageSize)
      }
    } : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
  })

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" role="grid">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider',
                      header.column.getCanSort() && 'cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="inline-flex items-center">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5 text-primary-600" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="h-3.5 w-3.5 text-primary-600" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-primary-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={getRowId(row.original)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-slate-600 dark:text-slate-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, pagination.totalCount)} of{' '}
            {pagination.totalCount} results
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pagination.pageSize}
              onChange={e => pagination.onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-slate-300 rounded dark:border-slate-600 dark:bg-slate-800"
              aria-label="Page size"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size} per page</option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(0)}
              disabled={pagination.pageIndex === 0}
              aria-label="First page"
            >
              <ChevronsUpDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex === 0}
              aria-label="Previous page"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm text-slate-500">
              Page {pagination.pageIndex + 1} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex >= pagination.totalPages - 1}
              aria-label="Next page"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.totalPages - 1)}
              disabled={pagination.pageIndex >= pagination.totalPages - 1}
              aria-label="Last page"
            >
              <ChevronsUpDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}