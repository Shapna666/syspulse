import useSocketMetric from '../../hooks/useSocketMetric';
import SkeletonCard from '../common/SkeletonCard';

function BatteryCard() {
  const { latest: data, error } = useSocketMetric('battery:update');

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-battery)' }}>
        <h2 className="text-lg font-semibold mb-2">Battery</h2>
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }


  if (!data) {
    return <SkeletonCard />;
  }

  if (!data.hasBattery) {
    return (
      <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-battery)' }}>
        <h2 className="text-lg font-semibold mb-2">Battery</h2>
        <p className="text-gray-500 text-sm">No battery detected (desktop system)</p>
      </div>
    );
  }

  const barColor =
    data.percentage < 20 ? 'bg-red-500' : data.percentage < 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-battery)' }}>
      <h2 className="text-lg font-semibold mb-4">Battery</h2>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-3xl font-bold text-battery">{data.percentage}%</span>
        <span className="text-sm text-gray-400">{data.chargingStatus}</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${data.percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500">
        {data.estimatedRuntimeMinutes
          ? `${Math.floor(data.estimatedRuntimeMinutes / 60)}h ${data.estimatedRuntimeMinutes % 60}m remaining`
          : 'Calculating remaining time...'}
      </p>
    </div>
  );
}

export default BatteryCard;