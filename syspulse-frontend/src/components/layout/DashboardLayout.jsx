function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 px-8 py-4">
        <h1 className="text-2xl font-bold">SysPulse</h1>
        <p className="text-sm text-gray-400">Enterprise System Health Monitoring</p>
      </header>
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;