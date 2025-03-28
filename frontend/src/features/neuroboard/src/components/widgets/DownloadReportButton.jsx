export default function DownloadReportButton() {
    const download = () => {
      window.open('http://localhost:8000/api/export/pdf', '_blank')
    }
  
    return (
      <div className="text-right mt-4">
        <button
          onClick={download}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        >
          🧾 Download Team Report (PDF)
        </button>
      </div>
    )
  }
  