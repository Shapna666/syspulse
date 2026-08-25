import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import SkeletonCard from '../common/SkeletonCard';

const METRICS = [
  { key: 'cpu', label: 'CPU' },
  { key: 'memory', label: 'Memory' },
  { key: 'disk', label: 'Disk' },
];

function SettingsPanel() {
  const [thresholds, setThresholds] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axiosClient
      .get('/settings/thresholds')
      .then((response) => setThresholds(response.data))
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (metric, value) => {
    setThresholds((current) => ({ ...current, [metric]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const response = await axiosClient.post('/settings/thresholds', {
        cpu: Number(thresholds.cpu),
        memory: Number(thresholds.memory),
        disk: Number(thresholds.disk),
      });
      setThresholds(response.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error && !thresholds) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Alert Settings</h2>
        <p className="text-critical">Error: {error}</p>
      </div>
    );
  }

  if (!thresholds) return <SkeletonCard />;

  return (
    <div className="max-w-xl bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-1">Alert Settings</h2>
      <p className="text-sm text-text-muted mb-6">Set the usage level that triggers a notification.</p>
      <form onSubmit={handleSave} className="space-y-4">
        {METRICS.map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between gap-4 text-sm">
            <span>{label} threshold</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={thresholds[key]}
                onChange={(event) => handleChange(key, event.target.value)}
                className="w-24 rounded-lg border border-border bg-bg px-3 py-2 text-right focus:border-accent focus:outline-none"
              />
              <span className="text-text-muted">%</span>
            </div>
          </label>
        ))}
        {error && <p className="text-sm text-critical">Error: {error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
        >
          {saved && <Check size={16} />}
          {saved ? 'Saved' : saving ? 'Saving...' : 'Save thresholds'}
        </button>
      </form>
    </div>
  );
}

export default SettingsPanel;
