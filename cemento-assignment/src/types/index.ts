export type ColumnType = "string" | "number" | "boolean" | "select";

export interface Column {
  // Represents a column in a data table with its properties
  id: string;
  ordinalNo: number;
  title: string;
  type: ColumnType;
  width?: number;
  options?: string[]; // for 'select' only
  visible?: boolean;
}

export interface Row {
  id: string;
  name?: string;
  age?: number;
  isActive?: boolean;
  role?: string;
  note?: string;
  [key: string]: any; // Keep this for future extensibility
}

export interface TableData {
  // Represents the complete data structure for a table, including columns and rows
  columns: Column[];
  data: Row[];
}
