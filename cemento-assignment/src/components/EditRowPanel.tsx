import React, { useState } from "react";
import type { Column, Row } from "../types";

type EditRowPanelProps = {
  row: Row;
  columns: Column[];
  onSave: (updatedRow: Row) => void;
  onCancel: () => void;
};

const EditRowPanel: React.FC<EditRowPanelProps> = ({
  row,
  columns,
  onSave,
  onCancel,
}) => {
  const [editedRow, setEditedRow] = useState<Row>({ ...row });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (columnId: string, value: any) => {
    setEditedRow((prev) => ({ ...prev, [columnId]: value }));
    setErrors((prev) => ({ ...prev, [columnId]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    columns.forEach((col) => {
      const val = editedRow[col.id];

      if (col.type === "string" && (!val || val.trim() === "")) {
        newErrors[col.id] = "This field is required";
      }

      if (col.type === "number") {
        if (val === "" || val === null || isNaN(val)) {
          newErrors[col.id] = "This field is required";
        } else if (val < 1) {
          newErrors[col.id] = "Must be at least 1";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const cleanedRow: Row = { ...editedRow };

    columns.forEach((col) => {
      if (
        col.type === "number" &&
        (cleanedRow[col.id] === "" || cleanedRow[col.id] === null)
      ) {
        cleanedRow[col.id] = 0;
      }
    });

    onSave(cleanedRow);
  };

  const renderInput = (column: Column) => {
    const value = editedRow[column.id];

    switch (column.type) {
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(column.id, e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value === 0 ? "" : value}
            onChange={(e) => {
              const raw = e.target.value;
              handleChange(column.id, raw === "" ? "" : Number(raw));
            }}
            className="w-full border px-3 py-2 rounded"
          />
        );

      case "boolean":
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleChange(column.id, e.target.checked)}
          />
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleChange(column.id, e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            {column.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white border shadow-xl p-6 rounded-lg w-[400px] space-y-4">
      {columns.map((column) => (
        <div key={column.id}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {column.title}
          </label>
          {renderInput(column)}
          {errors[column.id] && (
            <p className="text-red-500 text-xs">{errors[column.id]}</p>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditRowPanel;
