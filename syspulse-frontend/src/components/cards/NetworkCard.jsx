import useSocketMetric from '../../hooks/useSocketMetric';
import SkeletonCard from '../common/SkeletonCard';

function NetworkCard() {
  const { latest: data, error } = useSocketMetric('network:update');

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-network)' }}>
        <h2 className="text-lg font-semibold mb-2">Network</h2>
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }


  if (!data) {
    return <SkeletonCard />;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl border-t-2 p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200" style={{ borderTopColor: 'var(--color-network)' }}>
      <h2 className="text-lg font-semibold mb-4">Network</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">↓ Download</p>
          <p className="text-xl font-bold text-network">{data.downloadKBps} KB/s</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">↑ Upload</p>
          <p className="text-xl font-bold text-network">{data.uploadKBps} KB/s</p>
        </div>
      </div>

      <div className="text-sm space-y-1 border-t border-gray-700 pt-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Hostname</span>
          <span className="font-mono">{data.hostname}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">IP Address</span>
          <span className="font-mono">{data.ipAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Adapter</span>
          <span className="font-mono">{data.adapterName}</span>
        </div>
      </div>
    </div>
  );
}

export default NetworkCard;