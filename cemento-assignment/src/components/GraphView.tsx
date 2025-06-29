import { Bar } from "react-chartjs-2";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Column = { id: string; title: string; type: string };
type Row = Record<string, any> & { id: string };

type Props = {
  columns: Column[];
  data: Row[];
};

export default function GraphView({ columns, data }: Props) {
  const [mode, setMode] = useState<"age" | "active" | "role">("age");

  const buildChart = () => {
    if (mode === "age") {
      const buckets: Record<string, number> = {};
      data.forEach((r) => {
        const age = r.age;
        if (typeof age === "number") {
          const b = `${Math.floor(age / 5) * 5}-${Math.floor(age / 5) * 5 + 4}`;
          buckets[b] = (buckets[b] || 0) + 1;
        }
      });

      const sortedLabels = Object.keys(buckets).sort((a, b) => {
        const getStart = (str: string) => parseInt(str.split("-")[0], 10);
        return getStart(a) - getStart(b);
      });

      return {
        labels: sortedLabels,
        datasets: [
          {
            label: "Count",
            data: sortedLabels.map((label) => buckets[label]),
            backgroundColor: "#6366f1", // consistent purple for age
          },
        ],
      };
    }

    if (mode === "active") {
      const counts = { Active: 0, Inactive: 0 };
      data.forEach((r) => counts[r.isActive ? "Active" : "Inactive"]++);
      return {
        labels: ["Active", "Inactive"],
        datasets: [
          {
            label: "Count",
            data: [counts.Active, counts.Inactive],
            backgroundColor: ["#10b981", "#ef4444"], // green and red
          },
        ],
      };
    }

    if (mode === "role") {
      const counts: Record<string, number> = {};
      data.forEach((r) => (counts[r.role] = (counts[r.role] || 0) + 1));
      const sortedRoles = Object.keys(counts).sort();
      return {
        labels: sortedRoles,
        datasets: [
          {
            label: "Count",
            data: sortedRoles.map((role) => counts[role]),
            backgroundColor: "#3b82f6", // blue for roles
          },
        ],
      };
    }

    return { labels: [], datasets: [] };
  };

  const chartData = buildChart();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {["age", "active", "role"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as "age" | "active" | "role")}
              className={`px-4 py-2 rounded text-sm shadow-sm ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-700 border border-blue-600"
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Bar
          key={mode}
          data={chartData}
          options={{
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text:
                  mode === "age"
                    ? "Age Distribution"
                    : mode === "active"
                    ? "Active Status"
                    : "Role Distribution",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
