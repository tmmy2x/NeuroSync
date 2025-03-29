export default function FlowBlock({ block }) {
    return (
      <div className="border p-3 rounded bg-gray-50">
        <div className="font-semibold">{block.title}</div>
        <div className="text-xs text-gray-600">
          {block.start} – {block.end}
        </div>
        {block.note && <p className="text-sm mt-1">{block.note}</p>}
      </div>
    )
  }
  