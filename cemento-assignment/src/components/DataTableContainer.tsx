import { useEffect, useState } from "react";
import type { Column, Row } from "../types";
import { DataTable } from "./DataTable";
import EditRowPanel from "./EditRowPanel";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const downloadCSV = (rows: Row[], columns: Column[]) => {
  const headers = columns.map((c) => ({ label: c.title, key: c.id }));
  const data = rows.map((r) => {
    const obj: any = {};
    columns.forEach((c) => (obj[c.id] = r[c.id]));
    return obj;
  });
  return (
    <CSVLink
      data={data}
      headers={headers}
      filename="Cemento-Table.csv"
      className="px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 text-sm shadow"
    >
      📥 Export CSV
    </CSVLink>
  );
};

const downloadPDF = (rows: Row[], columns: Column[]) => {
  const doc = new jsPDF();
  const headers = [columns.map((c) => c.title)];
  const data = rows.map((r) => columns.map((c) => String(r[c.id])));
  autoTable(doc, { head: headers, body: data });
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

  const handleDelete = (rowId: string) => {
    const updatedData = tableData.filter((row) => row.id !== rowId);
    setTableData(updatedData);
    setEditingRow(null);

    const updatedTable = { columns, data: updatedData };
    sessionStorage.setItem("tableData", JSON.stringify(updatedTable));
  };

  const [sortColumn, setSortColumn] = useState<string | null>(() => {
    const storedSort = sessionStorage.getItem("sortColumn");
    return storedSort ? storedSort : null;
  });

  const [nextId, setNextId] = useState<number>(() => {
    const stored = sessionStorage.getItem("nextRowId");
    if (stored) return Number(stored);
    return data.length + 1;
  });

  const handleAddRow = () => {
    const newRow = createRow(columns, nextId);
    setEditingRow({ row: newRow, isNew: true });
    setNextId((prev) => prev + 1);
  };

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => {
    const storedOrder = sessionStorage.getItem("sortOrder");
    return storedOrder === "desc" ? "desc" : "asc";
  });

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const stored = sessionStorage.getItem("visibleColumns");
    return stored ? JSON.parse(stored) : columns.map((c) => c.id);
  });

  useEffect(() => {
    sessionStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
    if (sortColumn) sessionStorage.setItem("sortColumn", sortColumn);
    sessionStorage.setItem("sortOrder", sortOrder);
    sessionStorage.setItem("nextRowId", String(nextId));
  }, [visibleColumns, sortColumn, sortOrder, nextId]);

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

  const enrichedColumns = columns.map((col) => ({
    ...col,
    visible: visibleColumns.includes(col.id),
  }));

  let sortedData = [...tableData];
  if (sortColumn) {
    const meta = enrichedColumns.find((c) => c.id === sortColumn)!;
    sortedData.sort((a, b) => {
      const va = a[sortColumn],
        vb = b[sortColumn];
      if (meta.type === "number")
        return sortOrder === "asc" ? va - vb : vb - va;
      if (meta.type === "boolean")
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
      return sortOrder === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }

  const createRow = (columns: Column[], id: number): Row => {
    const empty: Row = { id: String(id) };
    columns.forEach((col) => {
      if (col.type === "boolean") empty[col.id] = false;
      else if (col.type === "select") empty[col.id] = "";
      else empty[col.id] = "";
    });
    return empty;
  };

  const filteredData = sortedData.filter((row) =>
    row.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative space-y-4">
      <div className="flex justify-between items-center px-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-64 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
        />

        <div className="flex items-center gap-2">
          {downloadCSV(filteredData, enrichedColumns)}

          <button
            onClick={() => downloadPDF(filteredData, enrichedColumns)}
            className="px-3 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 text-sm shadow"
          >
            📄 Export PDF
          </button>

          <button
            onClick={handleAddRow}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm shadow"
          >
            ➕ Add
          </button>
        </div>
      </div>
      <DataTable
        columns={enrichedColumns}
        data={filteredData}
        onRowDoubleClick={(row) => setEditingRow({ row, isNew: false })}
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
          setEditingRow({
            row: createRow(columns, tableData.length),
            isNew: true,
          })
        }
      />

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

      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-fadeIn z-50">
          Data changed successfully
        </div>
      )}
    </div>
  );
};
