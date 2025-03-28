export default function DashboardLayout({ children }) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <header className="p-4 bg-white shadow-md flex justify-between items-center">
          <h1 className="text-xl font-semibold">NeuroBoard™</h1>
          <span className="text-sm text-gray-500">Workplace Intelligence that Feels</span>
        </header>
        <main className="p-4">{children}</main>
      </div>
    )
  }
  