import type { Column, Row } from '../types';

type DataTableProps = {
  columns: Column[];
  data: Row[];
};

export const DataTable = ({ columns, data }: DataTableProps) => {
  return (
    <div className="max-h-[90vh] overflow-auto border rounded-md shadow">
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
            <tr key={row.id} className="even:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.id}
                  className="px-4 py-2 border-b text-sm text-gray-800"
                >
                  {renderStaticCell(row[column.id], column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function renderStaticCell(value: any, column: Column) {
  switch (column.type) {
    case 'boolean':
      return (
        <span
          className="inline-block w-4 h-4 rounded-full"
          style={{ backgroundColor: value ? '#4ade80' : '#f87171' }}
        />
      );
    case 'select':
    case 'string':
    case 'number':
    default:
      return <span>{String(value)}</span>;
  }
}
