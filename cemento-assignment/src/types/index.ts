export type ColumnType = "string" | "number" | "boolean" | "select";

export interface Column {
  // Represents a column in a data table with its properties
  id: string;
  ordinalNo: number;
  title: string;
  type: ColumnType;
  width?: number;
  options?: string[]; // for 'select' only
}

export interface Row {
  // Represents a row in a data table, containing data for each column
  id: string;
  [key: string]: any;
}

export interface TableData {
  // Represents the complete data structure for a table, including columns and rows
  columns: Column[];
  data: Row[];
}
