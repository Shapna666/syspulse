import { useState } from 'react';
import useSocketMetric from './hooks/useSocketMetric';
import Sidebar from './components/layout/Sidebar';
import HealthSummary from './components/cards/HealthSummary';
import SystemInfoCard from './components/cards/SystemInfoCard';
import CpuCard from './components/cards/CpuCard';
import MemoryCard from './components/cards/MemoryCard';
import DiskCard from './components/cards/DiskCard';
import NetworkCard from './components/cards/NetworkCard';
import BatteryCard from './components/cards/BatteryCard';
import ProcessTable from './components/cards/ProcessTable';
import ServicesTable from './components/cards/ServicesTable';
import AlertsPanel from './components/cards/AlertsPanel';
import SettingsPanel from './components/cards/SettingsPanel';

function App() {
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="flex min-h-screen bg-bg text-text-primary">
      <Sidebar activeView={activeView} onSelect={setActiveView} />

      <main className="flex-1 p-8 max-w-4xl">
        {activeView === 'overview' && <Overview />}
        {activeView === 'settings' && <SettingsPanel />}

        {activeView === 'system' && <SystemInfoCard />}
        {activeView === 'cpu' && <CpuCard />}
        {activeView === 'memory' && <MemoryCard />}
        {activeView === 'disk' && <DiskCard />}
        {activeView === 'network' && <NetworkCard />}
        {activeView === 'battery' && <BatteryCard />}
        {activeView === 'processes' && <ProcessTable />}
        {activeView === 'services' && <ServicesTable />}
      </main>
    </div>
  );
}

function Overview() {
  const { latest: cpu, history: cpuHistory } = useSocketMetric('cpu:update', {
    windowSeconds: 60,
    select: (d) => ({ value: d.usagePercent }),
  });
  const { latest: memory, history: memoryHistory } = useSocketMetric('memory:update', {
    windowSeconds: 60,
    select: (d) => ({ value: d.usagePercent }),
  });
  const { latest: disk, history: diskHistory } = useSocketMetric('disk:update', {
    windowSeconds: 60,
    select: (d) => ({ value: d?.[0]?.usagePercent ?? 0 }),
  });

  return (
    <div className="space-y-6">
      <AlertsPanel />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="md:col-span-2 xl:col-span-2"><HealthSummary cpu={cpu} memory={memory} disk={disk} /></div>
        <div className="md:col-span-2 xl:col-span-2"><NetworkCard /></div>
        <CpuCard compact externalData={cpu} externalHistory={cpuHistory} />
        <MemoryCard compact externalData={memory} externalHistory={memoryHistory} />
        <DiskCard compact externalData={disk} externalHistory={diskHistory} />
        <BatteryCard />
      </div>
    </div>
  );
}

export default App;