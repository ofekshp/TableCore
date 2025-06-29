import { useEffect, useState } from "react";
import type { Column, Row } from "../types";
import { DataTable } from "./DataTable";
import EditRowPanel from "./EditRowPanel";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NotePanel from "./NotePanel";
const PAGE_DELTA = 3;

const downloadPDF = (rows: Row[], columns: Column[]) => {
  const doc = new jsPDF();

  const headers = [columns.map((c) => c.title)];
  const data = rows.map((r) => columns.map((c) => String(r[c.id])));

  const columnStyles: Record<number, any> = {};
  const noteIndex = columns.findIndex((c) => c.id === "note");

  if (noteIndex !== -1) {
    columnStyles[noteIndex] = {
      cellWidth: 60, // constrain width
      halign: "left",
      valign: "top",
    };
  }

  autoTable(doc, {
    head: headers,
    body: data,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
    },
    columnStyles,
  });

  doc.save("Cemento-Table.pdf");
};

type Props = {
  columns: Column[];
  data: Row[];
};

export const DataTableContainer = ({ columns, data }: Props) => {
  const [tableData, setTableData] = useState<Row[]>(data);
  const [editingRow, setEditingRow] = useState<{
    row: Row;
    isNew: boolean;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [noteRow, setNoteRow] = useState<Row | null>(null);
  const [rowToDelete, setRowToDelete] = useState<Row | null>(null);

  const handleDelete = (rowId: string) => {
    const updatedData = tableData.filter((row) => row.id !== rowId);
    setTableData(updatedData);
    setEditingRow(null);
    sessionStorage.setItem(
      "tableData",
      JSON.stringify({ columns, data: updatedData })
    );
  };

  const [sortColumn, setSortColumn] = useState<string | null>(
    () => sessionStorage.getItem("sortColumn") || null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() =>
    sessionStorage.getItem("sortOrder") === "desc" ? "desc" : "asc"
  );
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const stored = sessionStorage.getItem("visibleColumns");
    return stored ? JSON.parse(stored) : columns.map((c) => c.id);
  });

  useEffect(() => {
    sessionStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
    if (sortColumn) sessionStorage.setItem("sortColumn", sortColumn);
    sessionStorage.setItem("sortOrder", sortOrder);
  }, [visibleColumns, sortColumn, sortOrder]);

  const handleSave = (updatedRow: Row, isNew: boolean) => {
    const updatedData = isNew
      ? [...tableData, updatedRow]
      : tableData.map((r) => (r.id === updatedRow.id ? updatedRow : r));
    setTableData(updatedData);
    setEditingRow(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    sessionStorage.setItem(
      "tableData",
      JSON.stringify({ columns, data: updatedData })
    );
  };

  const handleSort = (colId: string) => {
    if (sortColumn === colId)
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortColumn(colId);
      setSortOrder("asc");
    }
  };

  const createRow = (columns: Column[]): Row => {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const empty: Row = { id: uniqueId };
    columns.forEach((col) => {
      if (col.type === "boolean") empty[col.id] = false;
      else empty[col.id] = "";
    });
    return empty;
  };

  const handleNoteSave = (note: string) => {
    if (!noteRow) return;
    const updatedData = tableData.map((r) =>
      r.id === noteRow.id ? { ...r, note } : r
    );
    setTableData(updatedData);
    setNoteRow(null);
    sessionStorage.setItem(
      "tableData",
      JSON.stringify({ columns, data: updatedData })
    );
  };

  const exportColumns: Column[] = [
    ...columns,
    {
      id: "note",
      title: "Note",
      type: "string",
      ordinalNo: columns.length + 1,
      visible: true,
    },
  ];

  const enrichedColumns = columns.map((c) => ({
    ...c,
    visible: visibleColumns.includes(c.id),
  }));

  // Sort only the data, based on sortColumn/sortOrder
  let sortedData = [...tableData];
  if (sortColumn) {
    const meta = enrichedColumns.find((c) => c.id === sortColumn)!;
    sortedData.sort((a, b) => {
      const va = a[sortColumn],
        vb = b[sortColumn];
      if (meta.type === "number") {
        return sortOrder === "asc" ? va - vb : vb - va;
      }
      if (meta.type === "boolean") {
        return sortOrder === "asc"
          ? va === vb
            ? 0
            : va
            ? -1
            : 1
          : va === vb
          ? 0
          : va
          ? 1
          : -1;
      }
      return sortOrder === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }

  const filteredData = sortedData.filter((row) =>
    row.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="relative space-y-4">
      <div className="flex justify-between items-center px-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-md w-64 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
        />
        <div className="flex gap-2">
          <CSVLink
            data={filteredData}
            headers={exportColumns.map((c) => ({ label: c.title, key: c.id }))}
            filename="Cemento-Table.csv"
            className="px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 text-sm shadow"
          >
            📥 Export CSV
          </CSVLink>

          <button
            onClick={() => downloadPDF(filteredData, exportColumns)}
            className="px-3 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 text-sm shadow"
          >
            📄 Export PDF
          </button>

          <button
            onClick={() =>
              setEditingRow({ row: createRow(columns), isNew: true })
            }
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm shadow"
          >
            ➕ Add
          </button>
        </div>
      </div>

      <DataTable
        columns={enrichedColumns}
        data={paginatedData}
        onEditRow={(row) => setEditingRow({ row, isNew: false })}
        onSort={handleSort}
        sortColumn={sortColumn ?? undefined}
        sortOrder={sortOrder}
        onToggleColumn={(colId) => {
          setVisibleColumns((prev) =>
            prev.includes(colId)
              ? prev.filter((id) => id !== colId)
              : [...prev, colId]
          );
        }}
        onAddNewRow={() =>
          setEditingRow({ row: createRow(columns), isNew: true })
        }
        setRowToDelete={setRowToDelete}
        onNoteClick={(row) => setNoteRow(row)}
      />

      <div className="flex justify-center items-center mt-4 gap-2">
        {/* Prev */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.max(1, prev - PAGE_DELTA))
          }
          disabled={currentPage <= 1}
          className="px-2 py-1 rounded bg-white text-blue-700 border hover:bg-blue-100 disabled:opacity-50"
        >
          ←
        </button>

        {Array.from({ length: PAGE_DELTA }, (_, i) => {
          const page =
            Math.floor((currentPage - 1) / PAGE_DELTA) * PAGE_DELTA + i + 1;
          if (page > totalPages) return null;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + PAGE_DELTA))
          }
          disabled={currentPage + PAGE_DELTA > totalPages}
          className="px-2 py-1 rounded bg-white text-blue-700 border hover:bg-blue-100 disabled:opacity-50"
        >
          →
        </button>
      </div>

      {editingRow && (
        <EditRowPanel
          row={editingRow.row}
          columns={columns}
          onSave={(updatedRow) => handleSave(updatedRow, editingRow.isNew)}
          onCancel={() => setEditingRow(null)}
          onDelete={handleDelete}
          isNew={editingRow.isNew}
        />
      )}

      {noteRow && (
        <NotePanel
          row={noteRow}
          onCancel={() => setNoteRow(null)}
          onSave={(note) => handleNoteSave(note)}
        />
      )}

      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-fadeIn z-50">
          Data changed successfully
        </div>
      )}

      {rowToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] space-y-5 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete
              <br />
              <span className="text-red-600 font-bold">
                "{rowToDelete.name}"
              </span>
              ?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDelete(rowToDelete.id);
                  setRowToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setRowToDelete(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
