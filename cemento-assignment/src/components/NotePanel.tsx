import { useState } from "react";
import type { Row } from "../types";

type Props = {
  row: Row;
  onCancel: () => void;
  onSave: (note: string) => void;
};

export default function NotePanel({ row, onCancel, onSave }: Props) {
  const [note, setNote] = useState<string>(row.note ?? "");
  const [error, setError] = useState<string>("");

  const validateNote = (text: string) => {
    const isValid = /^[a-zA-Z0-9\s.,!?'"()-]*$/.test(text);
    if (!text.trim()) return "Note cannot be empty.";
    if (!isValid)
      return "Only English letters, numbers and punctuation allowed.";
    if (text.length > 100) return "Note cannot exceed 100 characters.";
    return "";
  };

  const handleSave = () => {
    const validationError = validateNote(note);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(note);
  };

  const handleClear = () => {
    setNote("");
    onSave(""); // Explicitly clear note
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          🗒️ Note for {row.name}
        </h3>
        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={5}
          value={note}
          maxLength={100}
          onChange={(e) => {
            setNote(e.target.value);
            setError("");
          }}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-between gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Clear Note
          </button>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
