import { useEffect, useRef, useState } from "react";
import type { Column, Row } from "../types";

type DataTableProps = {
  columns: Column[];
  data: Row[];
  onSort: (colId: string) => void;
  sortColumn?: string;
  sortOrder?: "asc" | "desc";
  onToggleColumn: (colId: string) => void;
  onAddNewRow: () => void;
  onEditRow: (row: Row) => void;
  setRowToDelete: (row: Row) => void;
  onNoteClick: (row: Row) => void;
};

export const DataTable = ({
  columns,
  data,
  onSort,
  sortColumn,
  sortOrder,
  onToggleColumn,
  onEditRow,
  setRowToDelete,
  onNoteClick,
}: DataTableProps) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderCell = (value: any, col: Column) => {
    if (col.type === "boolean") return value ? "✅" : "❌";
    return String(value);
  };

  return (
    <div className="relative max-h-[1000vh] overflow-auto border rounded-md shadow">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 bg-blue-100 z-10">
          <tr>
            <th className="text-center px-2 py-2 border-b font-semibold text-sm text-gray-700 w-10">
              #
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                style={{ width: column.width }}
                className="px-4 py-2 border-b font-semibold text-sm text-gray-700"
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
            <th className="w-16 px-2 py-2 border-b bg-blue-100" />
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} className="even:bg-gray-50 hover:bg-blue-50">
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
              <td className="px-2 py-2 border-b text-center relative flex justify-center items-center gap-2">
                <div className="relative group">
                  <button
                    onDoubleClick={() => onNoteClick(row)}
                    className="text-xl hover:scale-110 transition-transform duration-150"
                  >
                    {row.note?.trim() ? "🗒️" : "📝"}
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-20">
                    Note
                  </div>
                </div>
                <button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === row.id ? null : row.id)
                  }
                  className="hover:text-blue-700 font-bold text-lg"
                  title="More actions"
                >
                  ⋮
                </button>
                {menuOpenId === row.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white border rounded shadow z-10 w-24"
                  >
                    <button
                      onClick={() => onEditRow(row)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setRowToDelete(row)}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
