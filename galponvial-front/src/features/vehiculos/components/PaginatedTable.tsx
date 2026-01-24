import React from 'react';
import { Button } from '@/shared/ui/Button';

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (value: unknown, item: T) => React.ReactNode;
  width?: string;
}

interface PaginatedTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onNextPage: () => Promise<void>;
  onPreviousPage: () => Promise<void>;
  onGoToPage: (page: number) => Promise<void>;
  title: string;
  emptyMessage?: string;
}

/**
 * Reusable paginated table component (read-only)
 */
export const PaginatedTable = <T,>({
  columns,
  data,
  loading,
  error,
  page,
  totalPages,
  total,
  pageSize,
  onNextPage,
  onPreviousPage,
  onGoToPage,
  title,
  emptyMessage = 'No hay datos disponibles',
}: PaginatedTableProps<T>): React.ReactElement => {
  const handleGoToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onGoToPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">Error al cargar datos</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando...</span>
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}

      {!loading && data.length > 0 && (
        <>
          {/* Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  {columns.map((column, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                      style={{ width: column.width }}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-gray-100 hover:bg-gray-50">
                    {columns.map((column, colIdx) => {
                      const value = (item as Record<string, unknown>)[column.key as string];
                      return (
                        <td key={colIdx} className="px-4 py-3 text-sm text-gray-700">
                          {column.render ? column.render(value, item) : (value as React.ReactNode) ?? '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info & Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{(page - 1) * pageSize + 1}</span> a{' '}
              <span className="font-semibold">{Math.min(page * pageSize, total)}</span> de{' '}
              <span className="font-semibold">{total}</span> registros
            </div>

            {/* Page controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onPreviousPage}
                disabled={page === 1 || loading}
              >
                Anterior
              </Button>

              {/* Page numbers */}
              <div className="flex gap-1 items-center">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleGoToPage(pageNum)}
                      disabled={loading}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={onNextPage}
                disabled={page === totalPages || loading}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
