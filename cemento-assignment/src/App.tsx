import { useState } from 'react';
import { generateMockTableData } from './utils/generateMockData';
import type { TableData } from './types';

function App() {
  const [tableData, setTableData] = useState<TableData>(() => generateMockTableData(200));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Mock Data Loaded </h1>
      <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-[60vh]">
        {JSON.stringify(tableData, null, 2)}
      </pre>
    </div>
  );
}

export default App;
