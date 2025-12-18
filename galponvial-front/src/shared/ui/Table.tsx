import React, { ReactNode } from 'react';

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  rowClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  ({ data, columns, className = '', rowClassName = '' }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={`w-full border-collapse border border-gray-300 ${className}`}
        >
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="border border-gray-300 px-4 py-2 text-left font-semibold"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={`hover:bg-gray-50 ${rowClassName}`}>
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';
