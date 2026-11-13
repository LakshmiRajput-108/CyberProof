import React from 'react';
import { Scan } from '../../types/scan';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';

interface HistoryStatsChartsProps {
  scans: Scan[];
}

export const HistoryStatsCharts: React.FC<HistoryStatsChartsProps> = ({ scans }) => {
  const { isDark } = useTheme();

  // If fewer than 2 scans, charts should communicate baseline honesty
  if (scans.length < 2) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-center space-y-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Security Statistics
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Multi-scan trend visualizations unlock once at least two scans are recorded for this domain.
        </p>
      </div>
    );
  }

  // Sorted ascending for chronological graphs
  const chronological = [...scans].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // 1. Trend Data: recorded risk-state movement over time
  // This chart is intentionally separate from the 0-100 Trust Journey shown above.
  const trendData = chronological.map(scan => {
    let score = 2;
    if (scan.risk_level === 'LOW') score = 1;
    if (scan.risk_level === 'MEDIUM') score = 3;
    if (scan.risk_level === 'HIGH') score = 4;

    const dateStr = new Date(scan.created_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });

    const verified = scan.evidence.filter(e => e.status === 'Verified').length;
    const attention = scan.evidence.filter(e => e.importance === 'critical' || e.importance === 'high' || e.status === 'Unable to Verify').length;

    return {
      date: dateStr,
      riskLevel: scan.risk_level,
      score,
      checks: scan.evidence.length,
      verified,
      attention,
    };
  });

  // 2. Current Evidence category breakdown
  const latestScan = chronological[chronological.length - 1];
  const categoryCounts = {
    Identity: latestScan.evidence.filter(e => e.category === 'Identity').length,
    Security: latestScan.evidence.filter(e => e.category === 'Security').length,
    Behavior: latestScan.evidence.filter(e => e.category === 'Behavior').length,
    Context: latestScan.evidence.filter(e => e.category === 'Context').length,
  };

  const donutData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const DONUT_COLORS = ['#14B8A6', '#10B981', '#3B82F6', '#8B5CF6'];

  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const tooltipBg = isDark ? '#0D1526' : '#FFFFFF';
  const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            <span>Security Statistics & Evolution</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Empirical metrics charted across recorded scan snapshots.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Checks & Attention Signals Over Time */}
        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-500" />
              <span>Security Checks & Attention Signals</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">Total vs Flagged</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#FFF' : '#000',
                  }}
                />
                <Bar dataKey="checks" name="Evaluated Signals" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attention" name="Attention Concerns" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Verified Signal Ratio (Donut) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-500" />
              <span>Current Evidence Distribution</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">By Category</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#FFF' : '#000',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {donutData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
