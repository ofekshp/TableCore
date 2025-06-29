import { useState } from "react";
import type { Row } from "../types";

type Props = {
  row: Row;
  onCancel: () => void;
  onSave: (note: string) => void;
};

export default function NotePanel({ row, onCancel, onSave }: Props) {
  const [note, setNote] = useState<string>(row.note ?? "");
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmed = note.trim();
    if (!trimmed) {
      setError("Note cannot be empty.");
      return;
    }
    if (!/^[\w\s.,!?'"()-]*$/.test(trimmed)) {
      setError("Only English letters, numbers and punctuation allowed.");
      return;
    }
    if (trimmed.length > 100) {
      setError("Note must be under 100 characters.");
      return;
    }

    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] space-y-4 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-800">
            🗒️ Note for {row.name}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        {isEdit ? (
          <>
            <textarea
              className="w-full border rounded p-2 text-sm resize-none"
              rows={6}
              value={note}
              maxLength={100}
              onChange={(e) => setNote(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setNote("");
                  setError("");
                  onSave(""); // 🚨 immediately persist empty note
                }}
                className="text-sm px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 shadow"
              >
                Clear
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setNote(row.note ?? "");
                    setIsEdit(false);
                    setError("");
                  }}
                  className="text-sm px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-sm px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Save
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-800 whitespace-pre-wrap border rounded p-3 bg-gray-50 break-all">
              {note || (
                <span className="text-gray-400 italic">No note added.</span>
              )}
            </div>

            {/* Edit button bottom-left */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => setIsEdit(true)}
                className="text-sm px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 shadow"
              >
                ✏️ Edit Note
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
