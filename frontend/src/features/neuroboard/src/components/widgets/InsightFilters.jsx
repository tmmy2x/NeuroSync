export default function InsightFilters({ filters, setFilters }) {
    return (
      <div className="flex gap-4 items-center flex-wrap mb-4">
        <input
          type="text"
          placeholder="User"
          value={filters.user}
          onChange={e => setFilters({ ...filters, user: e.target.value })}
          className="border px-2 py-1 rounded text-sm"
        />
        <select
          value={filters.emotion}
          onChange={e => setFilters({ ...filters, emotion: e.target.value })}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">All Emotions</option>
          <option value="joy">Joy</option>
          <option value="sadness">Sadness</option>
          <option value="anger">Anger</option>
          <option value="calm">Calm</option>
        </select>
        <select
          value={filters.days}
          onChange={e => setFilters({ ...filters, days: parseInt(e.target.value) })}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>
    )
  }
  