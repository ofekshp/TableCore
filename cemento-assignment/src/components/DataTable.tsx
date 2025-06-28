import type { Column, Row } from "../types";

type DataTableProps = {
  columns: Column[];
  data: Row[];
  onRowDoubleClick?: (row: Row) => void;
  onSort: (colId: string) => void;
  sortColumn?: string;
  sortOrder?: "asc" | "desc";
  onToggleColumn: (colId: string) => void;
  onAddNewRow: () => void;
};

export const DataTable = ({
  columns,
  data,
  onRowDoubleClick,
  onSort,
  sortColumn,
  sortOrder,
  onToggleColumn,
}: DataTableProps) => {
  const renderCell = (value: any, col: Column) => {
    if (col.type === "boolean") return value ? "✅" : "❌";
    return String(value);
  };

  return (
    <div className="relative max-h-[1000vh] overflow-auto border rounded-md shadow">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 bg-blue-100 z-10">
          <tr>
            <th className="text-center px-2 py-2 border-b font-semibold text-sm text-gray-700 bg-blue-100 w-10">
              #
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                style={{ width: column.width }}
                className="px-4 py-2 border-b font-semibold text-sm text-gray-700 bg-blue-100"
              >
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 font-semibold hover:underline cursor-pointer"
                    onClick={() => onSort(column.id)}
                    title="Sort"
                  >
                    {column.title}
                    {sortColumn === column.id
                      ? sortOrder === "asc"
                        ? "🔼"
                        : "🔽"
                      : "↕️"}
                  </button>
                  <button
                    className="hover:text-gray-900 cursor-pointer"
                    onClick={() => onToggleColumn(column.id)}
                    title="Toggle visibility"
                  >
                    👁️
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              onDoubleClick={() => onRowDoubleClick?.(row)}
              className="even:bg-gray-50 hover:bg-blue-50 cursor-pointer"
            >
              <td className="text-center px-2 py-2 border-b text-sm text-gray-600 font-mono">
                {index + 1}
              </td>
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={`px-4 py-2 border-b text-gray-800 ${
                    col.visible ? "" : "opacity-0"
                  }`}
                >
                  {renderCell(row[col.id], col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
