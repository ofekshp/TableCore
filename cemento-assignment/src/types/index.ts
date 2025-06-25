export type ColumnType = 'string' | 'number' | 'boolean' | 'select';

export interface Column {
  id: string;
  ordinalNo: number;
  title: string;
  type: ColumnType;
  width?: number;
  options?: string[]; // for 'select' only
}

export interface Row {
  id: string;
  [key: string]: any;
}

export interface TableData {
  columns: Column[];
  data: Row[];
}
