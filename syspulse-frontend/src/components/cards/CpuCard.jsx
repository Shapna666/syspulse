import useSocketMetric from '../../hooks/useSocketMetric';
import LiveLineChart from '../charts/LiveLineChart';
import SkeletonCard from '../common/SkeletonCard';

function CpuCard({ compact = false, externalData, externalHistory }) {
  if (externalData !== undefined) {
    if (externalData === null) {
      return <SkeletonCard />;
    }

    return <CpuCardContent compact={compact} data={externalData} history={Array.isArray(externalHistory) ? externalHistory : []} />;
  }

  return <PollingCpuCard compact={compact} />;
}

function PollingCpuCard({ compact }) {
  const { latest: data, history, error } = useSocketMetric('cpu:update', {
    windowSeconds: 60,
    select: (d) => ({ value: d.usagePercent }),
  });

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-cpu)' }}>
        <h2 className="text-lg font-semibold mb-2">CPU</h2>
        <p className="text-critical">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return <SkeletonCard />;
  }

  return <CpuCardContent compact={compact} data={data} history={Array.isArray(history) ? history : []} />;
}

function CpuCardContent({ compact, data, history }) {
  return (
    <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-cpu)' }}>
      <h2 className="text-lg font-semibold mb-4">CPU</h2>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-3xl font-bold text-cpu">{data.usagePercent}%</span>
        <span className="text-sm text-text-muted">
          {data.physicalCores} cores / {data.logicalProcessors} threads
        </span>
      </div>
      <p className="text-xs text-text-muted mb-4 truncate">{data.processorName}</p>
      <LiveLineChart data={history} dataKey="value" color="var(--color-accent)" domain={[0, 100]} height={compact ? 64 : 220} compact={compact} />
    </div>
  );
}

export default CpuCard;