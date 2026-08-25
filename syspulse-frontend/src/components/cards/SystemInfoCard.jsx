import usePolling from '../../hooks/usePolling';
import SkeletonCard from '../common/SkeletonCard';

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1.5">
      <span className="text-text-muted">{label}</span>
      <span className="font-mono text-right">{value || 'N/A'}</span>
    </div>
  );
}

function InfoGroup({ title, rows }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">{title}</h3>
      <div className="divide-y divide-border/50">
        {rows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </div>
  );
}

function SystemInfoCard() {
  const { data, error } = usePolling('/system/info', 15000); // system identity rarely changes

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">System Information</h2>
        <p className="text-critical">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return <SkeletonCard />;
  }

  const { system, os, hardware, storage, network } = data;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">System Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoGroup
          title="System"
          rows={[
            { label: 'Computer Name', value: system.computerName },
            { label: 'Hostname', value: system.hostname },
            { label: 'Manufacturer', value: system.manufacturer },
            { label: 'Model', value: system.model },
            { label: 'BIOS Version', value: system.biosVersion },
            { label: 'Serial Number', value: system.serialNumber },
          ]}
        />

        <InfoGroup
          title="Operating System"
          rows={[
            { label: 'Windows Version', value: os.windowsVersion },
            { label: 'Build Number', value: os.buildNumber },
            { label: 'Architecture', value: os.architecture },
            { label: 'Boot Time', value: os.bootTime },
            { label: 'Uptime', value: os.uptime },
          ]}
        />

        <InfoGroup
          title="Hardware"
          rows={[
            { label: 'Processor', value: hardware.processorName },
            { label: 'Physical Cores', value: hardware.physicalCores },
            { label: 'Logical Processors', value: hardware.logicalProcessors },
            { label: 'Total RAM', value: `${hardware.totalRAMGB} GB` },
            { label: 'Available RAM', value: `${hardware.availableRAMGB} GB` },
          ]}
        />

        <InfoGroup
          title="Storage"
          rows={[
            { label: 'Total Storage', value: `${storage.totalGB} GB` },
            { label: 'Used Storage', value: `${storage.usedGB} GB` },
            { label: 'Free Storage', value: `${storage.freeGB} GB` },
          ]}
        />

        <InfoGroup
          title="Network"
          rows={[
            { label: 'IP Address', value: network.ipAddress },
            { label: 'MAC Address', value: network.macAddress },
            { label: 'Active Adapter', value: network.adapterName },
          ]}
        />
      </div>
    </div>
  );
}

export default SystemInfoCard;