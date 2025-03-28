import MoodHistoryChart from "../components/MoodHistoryChart";
import MoodSummary from "../components/MoodSummary";

const HistoryTab = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🕒 Mood History</h1>

      {/* ✅ Export Buttons Here */}
      <div className="mb-4 flex gap-4">
        <button
          className="px-3 py-2 bg-indigo-600 text-white rounded"
          onClick={() => window.open("http://localhost:8000/export/mood-history/json")}
        >
          📦 Export JSON
        </button>

        <button
          className="px-3 py-2 bg-green-600 text-white rounded"
          onClick={() => window.open("http://localhost:8000/export/mood-history/csv")}
        >
          📄 Export CSV
        </button>
      </div>

      <MoodHistoryChart />
      <MoodSummary />
    </div>
  );
};

export default HistoryTab;
