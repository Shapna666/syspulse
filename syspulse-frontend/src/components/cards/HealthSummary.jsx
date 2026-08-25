import usePolling from '../../hooks/usePolling';
import SkeletonCard from '../common/SkeletonCard';

const STATUS_STYLES = {
  Excellent: { color: '#22c55e', label: 'Excellent', text: 'text-green-400', ring: '#22c55e' },
  Good: { color: '#14b8a6', label: 'Good', text: 'text-teal-400', ring: '#14b8a6' },
  Warning: { color: '#eab308', label: 'Warning', text: 'text-yellow-400', ring: '#eab308' },
  Critical: { color: '#ef4444', label: 'Critical', text: 'text-red-400', ring: '#ef4444' },
};

const RING_RADIUS = 40;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function ScoreRing({ score, color }) {
  const clamped = Math.max(0, Math.min(100, score || 0));
  const offset = RING_CIRCUMFERENCE - (clamped / 100) * RING_CIRCUMFERENCE;

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={RING_RADIUS}
          fill="none"
          stroke="#1f222b"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={RING_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-text-primary">{clamped}</span>
        <span className="text-[10px] uppercase tracking-wide text-text-muted">/ 100</span>
      </div>
    </div>
  );
}

function HealthSummary({ cpu, memory, disk }) {
  const { data: health } = usePolling('/system/health-score', 4000);

  if (cpu == null || memory == null || disk == null) {
    return <SkeletonCard />;
  }

  const items = [
    { label: 'CPU', value: cpu?.usagePercent },
    { label: 'Memory', value: memory?.usagePercent },
    { label: 'Disk', value: disk?.[0]?.usagePercent },
  ].filter((item) => item.value !== undefined);

  if (items.length === 0) {
    return <SkeletonCard />;
  }

  const statusStyle = STATUS_STYLES[health?.status] || STATUS_STYLES.Excellent;
  const recommendations = health?.recommendations || [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">System Health</h2>
      </div>

      <div className="flex flex-col items-center mb-4">
        <ScoreRing score={health?.score} color={statusStyle.color} />
        <span className={`mt-2 text-sm font-medium ${statusStyle.text}`}>{statusStyle.label}</span>
      </div>

      {recommendations.length > 0 && (
        <ul className="mb-4 space-y-1 text-xs text-text-muted">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="mt-1.5 inline-block w-1 h-1 rounded-full bg-text-muted shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className="text-xl font-bold text-text-primary">{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthSummary;
