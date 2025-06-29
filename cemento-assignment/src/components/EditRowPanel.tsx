import React, { useEffect, useState } from "react";
import type { Column, Row } from "../types";

type EditRowPanelProps = {
  row: Row;
  columns: Column[];
  onSave: (updatedRow: Row) => void;
  onCancel: () => void;
  onDelete: (rowId: string) => void;
  isNew: boolean;
};

const EditRowPanel: React.FC<EditRowPanelProps> = ({
  row,
  columns,
  onSave,
  onCancel,
  isNew,
}) => {
  const [editedRow, setEditedRow] = useState<Row>({ ...row });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleChange = (columnId: string, value: any) => {
    setEditedRow((prev) => ({ ...prev, [columnId]: value }));
    setErrors((prev) => ({ ...prev, [columnId]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    columns.forEach((col) => {
      const val = editedRow[col.id];

      if (col.type === "string") {
        if (!val || val.trim() === "") {
          newErrors[col.id] = "This field is required";
        } else if (col.id === "name" && !/^[a-zA-Z\s]*$/.test(val)) {
          newErrors[col.id] = "Only English letters allowed";
        } else if (val.length > 25) {
          newErrors[col.id] = "Must be 25 characters or less";
        }
      }

      if (col.type === "number") {
        if (val === "" || val === null || isNaN(val)) {
          newErrors[col.id] = "This field is required";
        } else if (val < 0 || val > 140) {
          newErrors[col.id] = "Age must be between 0-140";
        }
      }

      if (col.type === "select" && (!val || val === "")) {
        newErrors[col.id] = "Please select a role";
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
            maxLength={25}
            onKeyDown={(e) => {
              if ([".", "'"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="w-full border px-3 py-2 rounded cursor-pointer"
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
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="w-full border px-3 py-2 rounded cursor-pointer"
            min={1}
            max={140}
          />
        );

      case "boolean":
        return (
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={value}
            onChange={(e) => handleChange(column.id, e.target.checked)}
          />
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleChange(column.id, e.target.value)}
            className="w-full border px-3 py-2 rounded cursor-pointer"
          >
            <option value="">Select a role</option>
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
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white border shadow-xl p-6 rounded-lg w-[400px] space-y-4">
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
    </div>
  );
};

export default EditRowPanel;
