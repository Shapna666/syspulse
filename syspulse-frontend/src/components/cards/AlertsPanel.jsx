import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import usePolling from '../../hooks/usePolling';
import SkeletonCard from '../common/SkeletonCard';

function formatTriggeredTime(timestamp) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
  if (elapsedSeconds < 60) return `${elapsedSeconds}s ago`;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  return `${Math.floor(elapsedMinutes / 60)}h ago`;
}

function AlertsPanel() {
  const { data: alerts, error } = usePolling('/alerts/active', 5000);

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Alerts</h2>
        <p className="text-critical">Error: {error}</p>
      </div>
    );
  }

  if (!alerts) return <SkeletonCard />;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Alerts</h2>
      {alerts.length === 0 ? (
        <div className="flex items-center gap-2 text-healthy">
          <CheckCircle2 size={18} />
          <span>All systems normal</span>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.metric} className="flex items-start gap-3 rounded-xl border border-critical/30 bg-critical/10 p-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-critical" />
              <div>
                <p className="text-sm text-text-primary">{alert.message}</p>
                <p className="mt-1 text-xs text-text-muted">Triggered {formatTriggeredTime(alert.triggeredAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsPanel;
