import { useEffect, useState } from "react";
import { generateMockData } from "./generateMockData";
import type { TableData } from "../types";

export const useInitialTableData = (): TableData | null => {
  const [tableData, setTableData] = useState<TableData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("tableData");

    if (stored) {
      setTableData(JSON.parse(stored));
    } else {
      const generated = generateMockData();
      setTableData(generated);
      sessionStorage.setItem("tableData", JSON.stringify(generated));
    }
  }, []);

  return tableData;
};
