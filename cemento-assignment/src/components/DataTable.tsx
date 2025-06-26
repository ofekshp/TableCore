import type { Column, Row } from "../types";

type DataTableProps = {
  columns: Column[];
  data: Row[];
  onRowDoubleClick?: (row: Row) => void;
};

export const DataTable = ({
  columns,
  data,
  onRowDoubleClick,
}: DataTableProps) => {
  const renderCellValue = (value: any, column: Column) => {
    if (column.type === "boolean") {
      return value ? (
        <span className="text-green-600 font-bold">✅</span>
      ) : (
        <span className="text-red-500 font-bold">❌</span>
      );
    }
    return String(value);
  };

  return (
    <div className="relative max-h-[1000vh] overflow-auto border rounded-md shadow">
      <table className="min-w-full table-auto border-collapse">
        <thead className="sticky top-0 z-10 bg-blue-100 text-left shadow-sm">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                style={{ width: column.width }}
                className="px-4 py-2 border-b font-semibold text-sm text-gray-700 bg-blue-100"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onDoubleClick={() => onRowDoubleClick?.(row)}
              className="even:bg-gray-50 cursor-pointer hover:bg-blue-50"
            >
              {columns.map((column) => (
                <td
                  key={column.id}
                  className="px-4 py-2 border-b text-sm text-gray-800"
                >
                  {renderCellValue(row[column.id], column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
