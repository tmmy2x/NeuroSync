export default function SmartPlannerToolbar({ onRefresh }) {
    return (
      <div className="flex justify-between mb-4">
        <span className="text-sm text-gray-500">AI-generated rhythm for today</span>
        <button
          onClick={onRefresh}
          className="bg-blue-600 text-white px-3 py-1 text-xs rounded"
        >
          🔁 Refresh
        </button>
      </div>
    )
  }
  