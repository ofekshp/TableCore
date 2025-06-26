import { useEffect, useState } from "react";
import type { Column, Row } from "../types";
import { DataTable } from "./DataTable";
import EditRowPanel from "./EditRowPanel";

type Props = {
  columns: Column[];
  data: Row[];
};

export const DataTableContainer = ({ columns, data }: Props) => {
  const [tableData, setTableData] = useState<Row[]>(data);
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const stored = sessionStorage.getItem("visibleColumns");
    return stored ? JSON.parse(stored) : columns.map((c) => c.id);
  });

  useEffect(() => {
    sessionStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handleSave = (updatedRow: Row) => {
    const updatedData = tableData.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    );

    setTableData(updatedData);
    setEditingRow(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    const updatedTable = { columns, data: updatedData };
    sessionStorage.setItem("tableData", JSON.stringify(updatedTable));
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const filteredColumns = columns.filter((col) =>
    visibleColumns.includes(col.id)
  );

  return (
    <div className="relative space-y-4">
      <div className="p-4 bg-white border rounded shadow-md">
        <div className="mb-3 flex justify-between items-center">
          <strong className="text-lg">Toggle Columns:</strong>
          <div className="space-x-2">
            <button
              onClick={() => setVisibleColumns(columns.map((c) => c.id))}
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"
            >
              Show All
            </button>
            <button
              onClick={() => setVisibleColumns([])}
              className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 text-sm"
            >
              Hide All
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {columns.map((col) => (
            <label key={col.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.id)}
                onChange={() =>
                  setVisibleColumns((prev) =>
                    prev.includes(col.id)
                      ? prev.filter((id) => id !== col.id)
                      : [...prev, col.id]
                  )
                }
              />
              {col.title}
            </label>
          ))}
        </div>
      </div>

      <DataTable
        columns={filteredColumns}
        data={tableData}
        onRowDoubleClick={(row) => setEditingRow(row)}
      />

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
