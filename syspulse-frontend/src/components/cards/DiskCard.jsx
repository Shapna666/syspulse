import useSocketMetric from '../../hooks/useSocketMetric';
import LiveLineChart from '../charts/LiveLineChart';
import SkeletonCard from '../common/SkeletonCard';

function DiskCard({ compact = false, externalData, externalHistory }) {
  if (externalData !== undefined) {
    if (externalData === null) {
      return <SkeletonCard />;
    }

    return <DiskCardContent compact={compact} data={externalData} history={Array.isArray(externalHistory) ? externalHistory : []} />;
  }

  return <PollingDiskCard compact={compact} />;
}

function PollingDiskCard({ compact }) {
  const { latest: data, history, error } = useSocketMetric('disk:update', {
    windowSeconds: 60,
    select: (d) => ({ value: d?.[0]?.usagePercent ?? 0 }),
  });

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-disk)' }}>
        <h2 className="text-lg font-semibold mb-2">Disk</h2>
        <p className="text-critical">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return <SkeletonCard />;
  }

  return <DiskCardContent compact={compact} data={data} history={Array.isArray(history) ? history : []} />;
}

function DiskCardContent({ compact, data, history }) {
  return (
    <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-disk)' }}>
      <h2 className="text-lg font-semibold mb-4">Disk</h2>

      <div className="space-y-4 mb-4">
        {data.map((disk) => {
          const barColor = disk.usagePercent > 90 ? 'bg-critical' : disk.usagePercent > 70 ? 'bg-warning' : 'bg-healthy';
          return (
            <div key={disk.drive}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-mono font-semibold">{disk.drive}</span>
                <span className="text-sm text-text-muted">
                  {disk.usedGB} GB / {disk.totalGB} GB
                </span>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-2 mb-1">
                <div className={`h-2 rounded-full ${barColor} transition-all duration-500`} style={{ width: `${disk.usagePercent}%` }} />
              </div>
              <p className="text-xs text-text-muted">{disk.freeGB} GB free ({disk.usagePercent}% used)</p>
            </div>
          );
        })}
      </div>

      {!compact && <p className="text-xs text-text-muted mb-2">{data[0]?.drive} usage trend</p>}
      <LiveLineChart data={history} dataKey="value" color="var(--color-accent)" domain={[0, 100]} height={compact ? 64 : 220} compact={compact} />
    </div>
  );
}

export default DiskCard;