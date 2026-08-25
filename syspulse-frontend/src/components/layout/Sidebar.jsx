import { useState } from 'react';
import {
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  BatteryFull,
  ListChecks,
  Settings2,
  Info,
  FileDown,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { downloadFile } from '../../api/axiosClient';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'system', label: 'System Info', icon: Info },
  { id: 'cpu', label: 'CPU', icon: Cpu },
  { id: 'memory', label: 'Memory', icon: MemoryStick },
  { id: 'disk', label: 'Disk', icon: HardDrive },
  { id: 'network', label: 'Network', icon: Wifi },
  { id: 'battery', label: 'Battery', icon: BatteryFull },
  { id: 'processes', label: 'Processes', icon: ListChecks },
  { id: 'services', label: 'Services', icon: Settings2 },
  { id: 'settings', label: 'Alert Settings', icon: SlidersHorizontal },
];

function Sidebar({ activeView, onSelect }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadFile('/report/export', 'SysPulse-Health-Report.pdf');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <aside className="w-56 shrink-0 bg-surface border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-6 flex items-center gap-2 border-b border-border">
        <span className="w-2 h-2 rounded-full bg-accent pulse-live" />
        <span className="text-text-primary font-semibold tracking-tight">SysPulse</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive
                  ? 'bg-surface-hover text-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'}`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
          {exporting ? 'Generating...' : 'Export Report'}
        </button>
      </div>

      <div className="px-5 py-4 border-t border-border text-xs text-text-muted">
        Local machine monitor
      </div>
    </aside>
  );
}

export default Sidebar;