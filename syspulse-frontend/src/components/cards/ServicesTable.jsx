import { useState, useMemo } from 'react';
import usePolling from '../../hooks/usePolling';
import SkeletonCard from '../common/SkeletonCard';

function ServicesTable() {
  const { data, error } = usePolling('/system/services', 10000); // services change rarely, poll slowly
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((svc) => {
      const matchesSearch =
        svc.displayName.toLowerCase().includes(search.toLowerCase()) ||
        svc.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || svc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200">
        <h2 className="text-lg font-semibold mb-2">Windows Services</h2>
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return <SkeletonCard />;
  }

  const runningCount = data.filter((s) => s.status === 'Running').length;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Windows Services</h2>
        <span className="text-xs text-gray-400">
          {runningCount} running / {data.length} total
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="All">All</option>
          <option value="Running">Running</option>
          <option value="Stopped">Stopped</option>
        </select>
      </div>

      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-800">
            <tr className="text-gray-400 text-left border-b border-gray-700">
              <th className="pb-2 pr-4">Display Name</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2">Start Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((svc) => (
              <tr key={svc.name} className="border-b border-gray-700/50">
                <td className="py-2 pr-4 truncate max-w-[220px]">{svc.displayName}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      svc.status === 'Running'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {svc.status}
                  </span>
                </td>
                <td className="py-2 text-gray-400">{svc.startType}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No services match your filter.</p>
        )}
      </div>
    </div>
  );
}

export default ServicesTable;