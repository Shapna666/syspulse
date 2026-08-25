import { X } from 'lucide-react';

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b border-border/50">
      <span className="text-text-muted">{label}</span>
      <span className="font-mono text-right break-all ml-4">{value || 'N/A'}</span>
    </div>
  );
}

function ProcessDetailsDrawer({ process, onClose }) {
  if (!process) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-surface border-l border-border h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{process.name}</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1">
          <DetailRow label="PID" value={process.pid} />
          <DetailRow label="Status" value={process.status} />
          <DetailRow label="CPU Time (s)" value={process.cpuTime} />
          <DetailRow label="Memory" value={`${process.memoryMB} MB (${process.memoryPercent}%)`} />
          <DetailRow label="Thread Count" value={process.threadCount} />
          <DetailRow label="Start Time" value={process.startTime} />
          <DetailRow label="Process Path" value={process.path} />
        </div>
      </div>
    </div>
  );
}

export default ProcessDetailsDrawer;