import { useState, useMemo } from 'react';
import { RefreshCw, ArrowUpDown } from 'lucide-react';
import usePolling from '../../hooks/usePolling';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import ProcessDetailsDrawer from './ProcessDetailsDrawer';
import SkeletonCard from '../common/SkeletonCard';

const PAGE_SIZE = 15;
const TOP_CONSUMER_THRESHOLD_CPU = 50; // seconds — highlight processes above this cumulative CPU time
const TOP_CONSUMER_THRESHOLD_MEM = 5; // percent

function ProcessTable() {
  const { data, error, refetch } = usePolling('/system/processes', 8000);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('cpuTime');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [selectedProcess, setSelectedProcess] = useState(null);

  const debouncedSearch = useDebouncedValue(search, 200);

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = debouncedSearch.toLowerCase();
    return data.filter(
      (p) => p.name.toLowerCase().includes(term) || String(p.pid).includes(term)
    );
  }, [data, debouncedSearch]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const valA = a[sortKey] ?? 0;
      const valB = b[sortKey] ?? 0;
      return sortDir === 'desc' ? valB - valA : valA - valB;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200">
        <h2 className="text-lg font-semibold mb-2">Processes</h2>
        <p className="text-critical">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return <SkeletonCard />;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Processes</h2>
        <button
          onClick={refetch}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name or PID..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-accent"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-muted text-left border-b border-border">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">PID</th>
              <th className="pb-2 pr-4 cursor-pointer select-none" onClick={() => handleSort('cpuTime')}>
                <span className="flex items-center gap-1">CPU Time <ArrowUpDown size={12} /></span>
              </th>
              <th className="pb-2 pr-4 cursor-pointer select-none" onClick={() => handleSort('memoryMB')}>
                <span className="flex items-center gap-1">Memory <ArrowUpDown size={12} /></span>
              </th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((proc) => {
              const isTopConsumer =
                proc.cpuTime > TOP_CONSUMER_THRESHOLD_CPU || proc.memoryPercent > TOP_CONSUMER_THRESHOLD_MEM;
              return (
                <tr
                  key={proc.pid}
                  onClick={() => setSelectedProcess(proc)}
                  className={`border-b border-border/50 cursor-pointer hover:bg-surface-hover transition-colors ${
                    isTopConsumer ? 'bg-warning/5' : ''
                  }`}
                >
                  <td className="py-2 pr-4 font-mono truncate max-w-[160px]">{proc.name}</td>
                  <td className="py-2 pr-4 text-text-muted">{proc.pid}</td>
                  <td className={`py-2 pr-4 ${isTopConsumer && proc.cpuTime > TOP_CONSUMER_THRESHOLD_CPU ? 'text-warning font-semibold' : ''}`}>
                    {proc.cpuTime}
                  </td>
                  <td className={`py-2 pr-4 ${isTopConsumer && proc.memoryPercent > TOP_CONSUMER_THRESHOLD_MEM ? 'text-warning font-semibold' : ''}`}>
                    {proc.memoryMB} MB <span className="text-text-muted text-xs">({proc.memoryPercent}%)</span>
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        proc.status === 'Running'
                          ? 'bg-healthy/20 text-healthy'
                          : 'bg-critical/20 text-critical'
                      }`}
                    >
                      {proc.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <p className="text-text-muted text-sm text-center py-6">No processes match your search.</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-text-muted">
        <span>
          Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-border disabled:opacity-40 hover:bg-surface-hover transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border border-border disabled:opacity-40 hover:bg-surface-hover transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <ProcessDetailsDrawer process={selectedProcess} onClose={() => setSelectedProcess(null)} />
    </div>
  );
}

export default ProcessTable;