import React from 'react'

import { combineClasses } from '@thesoulfresh/utils'

import { useWindowSize } from '~/utils';
import styles from './ResponsiveTable.module.scss'

export interface TableColumnOption<T> {
  /**
   * The display title to use in the table header. You can customize this
   * further by using the `renderHeaderCell` function of `ResponsiveTable`.
   */
  title: string
  /**
   * The key used to identify this column when looping through the columns to
   * render each cell in the table.
   */
  key: keyof T
}

export type GetRowURL = <T>(rowData: T, rowIndex: number, data: T[]) => string

export interface TableCellBaseProps<T> {
  column: TableColumnOption<T>
  columns: TableColumnOption<T>[]
  data: T[]
}

export type TableHeaderProps<T> = TableCellBaseProps<T> & Omit<React.HTMLProps<HTMLDivElement>, 'data'>;

export function TableHeader<T>({
  column,
  columns,
  data,
  children,
  className,
  ...rest
}: TableHeaderProps<T>) {
  return (
    <div
      data-testid="TableHeader"
      className={combineClasses(styles.TableHeader, className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export type TableHeaderRenderer<T> = (
  props: TableHeaderProps<T>,
) => React.ReactElement

export interface TableCellProps<T> extends TableCellBaseProps<T>, Omit<React.HTMLProps<HTMLTableCellElement>, 'data'> {
  heading?: React.ReactNode
  row: T
  rowIndex: number
}

export function TableCell<T>({
  heading = null,
  column,
  columns,
  row,
  rowIndex,
  data,
  children,
  className,
  ...rest
}: TableCellProps<T>) {
  return (
    <td
      data-testid="TableCell"
      className={className}
      {...rest}
    >
      {heading}
      {children}
    </td>
  )
}

export type TableCellRenderer<T> = (
  props: TableCellProps<T>,
) => React.ReactElement

export interface TableRowProps<T> extends Omit<React.HTMLProps<HTMLTableRowElement>, 'data'> {
  columns: TableColumnOption<T>[]
  row: T
  data: T[]
  index: number
  renderCell: TableCellRenderer<T>
}

export type TableRowRenderer<T> = (
  props: TableRowProps<T>,
) => React.ReactElement

export function TableRow<T>({
  row,
  columns,
  data,
  index: rowIndex,
  renderCell,
  className,
  ...rest
}: TableRowProps<T>) {
  return (
    <tr
      data-testid="TableRow"
      className={className}
      {...rest}
    >
      {columns.map((column, cellIndex) =>
        renderCell({
          key: cellIndex,
          data,
          columns,
          column,
          row,
          rowIndex,
        })
      )}
    </tr>
  )
}

export interface ResponsiveTableProps<T> extends Omit<React.HTMLProps<HTMLTableElement>, 'data'> {
  /**
   * The used to populate the table.
   */
  // TODO Rename rows
  data: T[]
  /**
   * The list of table columns to display.
   */
  columns: TableColumnOption<T>[]
  /**
   * Render a single row in the table.
   */
  renderRow?: TableRowRenderer<T>
  /**
   * Render a single cell in the table.
   */
  renderCell?: TableCellRenderer<T>
  /**
   * Render a table header cell.
   */
  renderHeader?: TableHeaderRenderer<T>
}

/**
 * `<Table>` can be used to render tabular data. Use the `columns` property to
 * describe the table columns. Use the `data` property to specify the data used
 * to populate the table. `data` is expected to be an array of objects where
 * each object represents a row of data. `columns` should be an array of `{key, title}`
 * objects where `key` is a property in each data row and `title` is the text to
 * use as the heading for that column.
 *
 * TODO Allow hiding the header row.
 * TODO Allow using Table without specifying the columns prop, which would
 * require passing the `renderRow` prop.
 */
export function ResponsiveTable<T>({
  data,
  columns,
  renderRow = (props) => <TableRow {...props} />,
  renderCell = (props) => <TableCell {...props} />,
  renderHeader = (props) => <TableHeader {...props} />,
  className,
  ...rest
}: ResponsiveTableProps<T>) {
  const [width] = useWindowSize();
  // @ts-ignore
  const mobileWidth = Number(styles.br);
  return (
    <table
      data-testid="Table"
      className={combineClasses(styles.Table, className)}
      {...rest}
    >
      <thead>
        <tr>
          {columns.map((column, index) => {
            return (
              <th key={index}>
                { renderHeader({
                  children: column.title,
                  column,
                  columns,
                  data,
                  key: index,
                }) }
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          return renderRow({
            columns,
            row,
            data,
            index,
            key: index,
            renderCell: ({
              // These should not flow through to the header components.
              row,
              rowIndex,
              column,
              ...cellProps
            }) =>
              renderCell({
                row,
                rowIndex,
                column,
                ...cellProps,
                heading: width && (width < mobileWidth)
                  ? renderHeader({
                    column,
                    'aria-hidden': true,
                    children: column.title,
                    ...cellProps,
                  })
                  : null
              }),
          })
        })}
      </tbody>
    </table>
  )
}

