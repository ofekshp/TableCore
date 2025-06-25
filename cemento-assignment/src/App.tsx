import { useState } from 'react';
import { generateMockTableData } from './utils/generateMockData';
import type { TableData } from './types';
import { DataTable } from './components/DataTable';

function App() {
  const [tableData] = useState<TableData>(() => generateMockTableData(200));

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">📊 Cemento Assignment</h1>
      <DataTable columns={tableData.columns} data={tableData.data} />
    </main>
  );
}

export default App;
