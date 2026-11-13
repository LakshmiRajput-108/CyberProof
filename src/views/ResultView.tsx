import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { AssessmentHero } from '../components/result/AssessmentHero';
import { EvidenceMatrix } from '../components/result/EvidenceMatrix';
import { WhyExplanationDrawer } from '../components/result/WhyExplanationDrawer';
import { RecommendedAction } from '../components/result/RecommendedAction';
import { BeforeYouEnterCard } from '../components/result/BeforeYouEnterCard';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Search } from 'lucide-react';

export const ResultView: React.FC = () => {
  const { selectedScan, scans, navigateTo } = useAppData();
  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);

  const activeScan = selectedScan || scans[0];

  if (!activeScan) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Analysis Selected</h2>
        <p className="text-xs text-slate-500">Run a scan to generate a transparent digital trust assessment.</p>
        <Button variant="primary" onClick={() => navigateTo('scan')}>
          Go to Scanner
        </Button>
      </div>
    );
  }

  const handleReScan = () => {
    navigateTo('scan', { tab: activeScan.analysis_type });
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('history')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Security History</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('scan')}
            leftIcon={<Search className="w-3.5 h-3.5" />}
          >
            New Scan
          </Button>
        </div>
      </div>

      {/* 1. Assessment Hero Card */}
      <AssessmentHero
        scan={activeScan}
        onOpenWhy={() => setIsWhyDrawerOpen(true)}
        onReScan={handleReScan}
      />

      {/* 2. Recommended Practical Actions */}
      <RecommendedAction
        actions={activeScan.recommended_actions}
        risk={activeScan.risk_level}
      />

      {/* 3. Evidence Matrix */}
      <EvidenceMatrix evidence={activeScan.evidence} />

      {/* 4. Signature Before You Enter Information Card */}
      <BeforeYouEnterCard onCheckWebsite={() => navigateTo('scan')} />

      {/* Signature Why Explanation Slide-Out Drawer */}
      <WhyExplanationDrawer
        scan={activeScan}
        isOpen={isWhyDrawerOpen}
        onClose={() => setIsWhyDrawerOpen(false)}
      />
    </div>
  );
};
