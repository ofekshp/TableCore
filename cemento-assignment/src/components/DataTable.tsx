import { useState } from 'react';
import type { Column, Row } from '../types';
import EditRowPanel from './EditRowPanel';

type DataTableProps = {
  columns: Column[];
  data: Row[];
};

export const DataTable = ({ columns, data }: DataTableProps) => {
  const [tableData, setTableData] = useState<Row[]>(data);
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (updatedRow: Row) => {
  const updatedData = tableData.map(row =>
    row.id === updatedRow.id ? updatedRow : row
  );

  setTableData(updatedData);
  setEditingRow(null);
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 3000);

  // Save to sessionStorage so it's preserved on refresh
  const updatedTable = { columns, data: updatedData };
  sessionStorage.setItem('tableData', JSON.stringify(updatedTable));
};


  const handleCancel = () => {
    setEditingRow(null);
  };

  const renderCellValue = (value: any, column: Column) => {
    if (column.type === 'boolean') {
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
          {tableData.map((row) => (
            <tr
              key={row.id}
              onDoubleClick={() => setEditingRow(row)}
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

      {editingRow && (
        <EditRowPanel
          row={editingRow}
          columns={columns}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg shadow-green-300 animate-fadeIn z-50">
          Data changed successfully
        </div>
      )}  

    </div>
  );
};
