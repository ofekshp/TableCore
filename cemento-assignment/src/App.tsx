import { DataTable } from './components/DataTable';
import { useInitialTableData } from './utils/useInitialTableData';

function App() {
  const tableData = useInitialTableData();

  if (!tableData) return <p className="text-center py-10">Loading table...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <h1 className="text-center text-3xl font-bold tracking-wide">Cemento Table Assignment</h1>
      </header>
      <main className="p-6">
        <DataTable columns={tableData.columns} data={tableData.data} />
      </main>
    </div>
  );
}

export default App;
