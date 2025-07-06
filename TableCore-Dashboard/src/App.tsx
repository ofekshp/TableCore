import { Routes, Route, useNavigate } from "react-router-dom";
import { DataTableContainer } from "./components/DataTableContainer";
import GraphView from "./components/GraphView";
import { useInitialTableData } from "./utils/useInitialTableData";
import { useLocation } from "react-router-dom";
import "./index.css";

function App() {
  const tableData = useInitialTableData();
  const navigate = useNavigate();
  const location = useLocation();

  if (!tableData) return <p className="text-center py-10">Loading table...</p>;

  const isTable = location.pathname === "/";
  const isGraph = location.pathname === "/graph";
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <h1 className="text-center text-3xl font-bold tracking-wide">
          Cemento Dashboard
        </h1>
      </header>

      <main className="p-6">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/")}
            className={`px-4 py-2 mx-2 rounded border text-sm shadow transition ${
              isTable
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 hover:bg-blue-100"
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => (window.location.href = "/graph")}
            className={`px-4 py-2 mx-2 rounded border text-sm shadow transition ${
              isGraph
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 hover:bg-blue-100"
            }`}
          >
            Graph View
          </button>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <DataTableContainer
                columns={tableData.columns}
                data={tableData.data}
              />
            }
          />
          <Route
            path="/graph"
            element={
              <GraphView
                key={Date.now()}
                columns={tableData.columns}
                data={tableData.data}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
