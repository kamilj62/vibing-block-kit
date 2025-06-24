import React, { useMemo } from 'react';
import { Card, Input, Button, Select } from '@heroui/react';
import { Text } from '../../components/Text';
import { Icon } from '@iconify/react';
import { 
  useTable, 
  useSortBy, 
  useGlobalFilter, 
  usePagination,
  ColumnInstance,
  UseSortByColumnProps,
  TableInstance,
  HeaderGroup,
  UsePaginationInstanceProps,
  UseSortByInstanceProps,
  UseGlobalFiltersInstanceProps,
  TableState,
  UsePaginationState,
  UseGlobalFiltersState,
  UseSortByState,
  UseSortByColumnOptions
} from 'react-table';

// Define the table state type with all plugins
type TableStateWithPlugins<T extends object> = TableState<T> & 
  UsePaginationState<T> & 
  UseGlobalFiltersState<T> & 
  UseSortByState<T> & {
    pageIndex: number;
    pageSize: number;
    globalFilter: string;
  };

// Define the table instance type with all plugins
type TableInstanceWithHooks<T extends object> = 
  TableInstance<T> &
  UsePaginationInstanceProps<T> &
  UseSortByInstanceProps<T> &
  UseGlobalFiltersInstanceProps<T> & {
    state: TableStateWithPlugins<T>;
  };

// Remove unused TableOptionsWithHooks type

// Extend the ColumnInstance to include our custom properties
type ExtendedColumnInstance<D extends object> = ColumnInstance<D> & 
  UseSortByColumnProps<D> & 
  UseSortByColumnOptions<D> & {
    canSort?: boolean;
    disableSortBy?: boolean;
    isSorted?: boolean;
    isSortedDesc?: boolean;
    sortable?: boolean;
    getSortByToggleProps?: (props?: Record<string, unknown>) => Record<string, unknown>;
  };



// Define the data row type - using Record<string, unknown> as the base
type DataRow = Record<string, unknown>;

// Extend react-table's Column type to include our custom properties
type ExtendedColumn<D extends object = DataRow> = {
  Header: string;
  accessor: Extract<keyof D, string>;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  id: string;
  // Add meta information for custom functionality
  meta?: {
    sortable?: boolean;
    filterable?: boolean;
  };
};

import { BlockProps } from '../../types';

// Define the table options type that matches our data structure
type TableOptions<D extends object> = {
  columns: Array<{
    Header: string;
    accessor: string;
    id: string;
    width?: number;
    meta?: {
      sortable?: boolean;
      filterable?: boolean;
    };
  }>;
  data: D[];
  initialState: {
    pageIndex: number;
    pageSize: number;
    sortBy: Array<{ id: string; desc: boolean }>;
    hiddenColumns: string[];
    globalFilter?: string;
  };
};

export interface DataGridColumn {
  field: string;
  headerName: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  // Add index signature for type compatibility
  [key: string]: unknown;
}

export interface DataGridBlockProps extends BlockProps {
  columns: DataGridColumn[];
  rows: Record<string, unknown>[];
  title?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  showFooter?: boolean;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

// No need for a separate TableState type as we're using the one from react-table

export const DataGridBlock: React.FC<Omit<DataGridBlockProps, 'onChange'>> = ({
  id,
  columns,
  rows = [],
  title,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  showFooter = true,
  bordered = true,
  striped = true,
  hoverable = true,
  className,
  ...props
}) => {
  // Transform columns for react-table with proper typing
  const tableColumns = useMemo<ExtendedColumn<DataRow>[]>(
    () => 
    columns.map(col => {
      // Validate that the field exists in the first row of data (if available)
      const firstRow = rows[0];
      if (firstRow && !(col.field in firstRow)) {
        console.warn(`Field "${col.field}" not found in data rows. This may cause runtime errors.`);
      }
      
      // Create a column definition that's compatible with react-table
      const column: ExtendedColumn<DataRow> = {
        id: col.field, // Required by react-table
        Header: col.headerName,
        accessor: col.field, // This is safe because we're working with string keys
        width: col.width,
      };

      // Add meta information for custom functionality
      if (col.sortable || col.filterable) {
        column.meta = {
          sortable: col.sortable,
          filterable: col.filterable,
        };
      }
      
      return column;
    }),
    [columns, rows]
  );

  // Memoize the columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => tableColumns, [tableColumns]);

  // Create properly typed table options
  const tableOptions: TableOptions<DataRow> = {
    columns: memoizedColumns.map(col => ({
      Header: col.Header,
      accessor: col.accessor,
      id: col.id,
      width: col.width,
      meta: col.meta
    })),
    data: rows,
    initialState: {
      pageIndex: 0,
      pageSize: defaultPageSize,
      sortBy: [],
      hiddenColumns: [],
      globalFilter: ''
    }
  };

  // Create the table instance with proper typing
  const tableInstance = useTable(
    tableOptions,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as TableInstanceWithHooks<DataRow>;

  // Destructure the table instance with proper typing
  // Destructure table instance methods and state
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize, globalFilter: globalFilterValue },
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    setPageSize: setPageSizeFn,
  } = tableInstance;

  // Use the filter value in the input
  const filterValue = useMemo(() => globalFilterValue || '', [globalFilterValue]);

  // Remove onChange from props to avoid type conflicts with Card's onChange
  // Use type assertion to handle the props spreading
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange: _onChange, ...cardProps } = props as Omit<DataGridBlockProps, 'onChange'> & Record<string, unknown>;
  
  return (
    <Card 
      className={className}
      data-block-id={id}
      {...cardProps}
    >
      {title && (
        <Text 
          as="h3" 
          size="lg" 
          weight="medium"
          p="3"
          borderBottom="1px solid"
          borderColor="border"
        >
          {title}
        </Text>
      )}

      <div className="p-3 flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Icon 
            icon="heroicons:magnifying-glass" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-muted"
          />
          <Input
            placeholder="Search..."
            size="sm"
            value={filterValue}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full pl-8"
          />
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--hero-spacing-2)'
        }}>
          <Text size="sm" color="foreground-muted">
            Show
          </Text>
          <Select
            value={pageSize}
            onChange={e => setPageSizeFn(Number(e.target.value))}
            size="sm"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <Text size="sm" color="foreground-muted">
            entries
          </Text>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {headerGroups.map((headerGroup: HeaderGroup<Record<string, unknown>>) => {
              const { key, ...headerProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key || `header-group-${headerGroup.id}`} {...headerProps}>
                  {headerGroup.headers.map((column: ColumnInstance<Record<string, unknown>>) => {
                    const typedColumn = column as unknown as ExtendedColumnInstance<Record<string, unknown>>;
                    const columnWithSort = column as unknown as { sortable?: boolean };
                    const sortable = columnWithSort.sortable ?? false;
                    
                    const { key: headerKey, ...headerColumnProps } = column.getHeaderProps(
                      sortable ? typedColumn.getSortByToggleProps?.() : {}
                    );
                    
                    return (
                      <th
                        key={headerKey}
                        {...headerColumnProps}
                        className={`px-4 py-2 text-left text-sm font-medium text-foreground-muted ${sortable ? 'cursor-pointer select-none' : ''}`}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.render('Header')}</span>
                          {sortable && (
                            <span className="flex flex-col">
                              <Icon 
                                icon="heroicons:chevron-up" 
                                className={`h-3 w-3 ${typedColumn.isSorted && !typedColumn.isSortedDesc ? 'text-primary' : 'text-foreground-muted'}`} 
                              />
                              <Icon 
                                icon="heroicons:chevron-down" 
                                className={`h-3 w-3 -mt-1 ${typedColumn.isSorted && typedColumn.isSortedDesc ? 'text-primary' : 'text-foreground-muted'}`} 
                              />
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex: number) => {
              prepareRow(row);
              return (
                <tr 
                  {...row.getRowProps()}
                  key={row.id}
                  style={{
                    ...(striped && rowIndex % 2 === 1 ? { backgroundColor: 'var(--hero-color-muted-50)' } : {}),
                    ...(hoverable ? { ':hover': { backgroundColor: 'var(--hero-color-muted-100)' } } : {})
                  }}
                >
                  {row.cells.map((cell) => (
                    <td 
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      style={{
                        padding: 'var(--hero-spacing-2)',
                        ...(bordered ? { border: '1px solid var(--hero-color-border)' } : {
                          borderBottom: '1px solid var(--hero-color-border)'
                        })
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
            
            {page.length === 0 && (
              <tr>
                <td 
                  colSpan={tableColumns.length}
                  style={{
                    textAlign: 'center',
                    padding: 'var(--hero-spacing-4)',
                    color: 'var(--hero-color-foreground-muted)'
                  }}
                >
                  No data to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showFooter && (
        <div className="p-3 flex items-center justify-between">
          <Text size="sm" color="foreground-muted">
            Showing {page.length > 0 ? pageIndex * pageSize + 1 : 0} to {Math.min((pageIndex + 1) * pageSize, rows.length)} of {rows.length} entries
          </Text>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              aria-label="First page"
            >
              <Icon icon="heroicons:chevron-double-left" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={previousPage}
              disabled={!canPreviousPage}
              aria-label="Previous page"
            >
              <Icon icon="heroicons:chevron-left" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextPage}
              disabled={!canNextPage}
              aria-label="Next page"
            >
              <Icon icon="heroicons:chevron-right" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pageCount > 0 && gotoPage(pageCount - 1)}
              disabled={!canNextPage || pageCount === 0}
              aria-label="Last page"
            >
              <Icon icon="heroicons:chevron-double-right" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};