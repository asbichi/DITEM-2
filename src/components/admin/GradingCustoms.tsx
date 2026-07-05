import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Shield, Sparkles, Check } from 'lucide-react';

export default function GradingCustoms() {
  const { gradingRules, updateGradingRules, currentUser } = useAppContext();
  const [localRules, setLocalRules] = useState(() => [...gradingRules]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFieldChange = (idx: number, field: string, val: any) => {
    setLocalRules(prev => prev.map((rule, i) => {
      if (i === idx) {
        return { ...rule, [field]: val };
      }
      return rule;
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick validation checks on boundaries
    let valid = true;
    for (let i = 0; i < localRules.length; i++) {
      const r = localRules[i];
      if (r.minScore < 0 || r.maxScore > 100 || r.minScore > r.maxScore) {
        alert(`Invalid score boundary for Grade ${r.grade}. Minimum must be less than maximum and between 0-100.`);
        valid = false;
        break;
      }
    }

    if (!valid) return;

    updateGradingRules(localRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const canModify = currentUser?.role === 'Super Administrator' || currentUser?.role === 'Examination Officer';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn">
      
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} className="text-blue-600" />
            <span>Customize Academic Grading System</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Modify institutional mark ranges and Grade Point values. Saving changes will recalculate all transcripts and certificates live.
          </p>
        </div>
        <Sparkles size={18} className="text-amber-500" />
      </div>

      {!canModify && (
        <div className="p-3 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold rounded-xl">
          READ-ONLY MODE: Your user session role does not have administrative rights to alter institutional configurations.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Grade Symbol</th>
                <th className="py-3 px-4">Minimum Score Threshold</th>
                <th className="py-3 px-4">Maximum Score Threshold</th>
                <th className="py-3 px-4">Grade Point Equivalent</th>
                <th className="py-3 px-4">Transcript Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {localRules.map((rule, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3 px-4 font-black text-sm text-slate-900 font-mono">
                    {rule.grade}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      disabled={!canModify}
                      type="number" min={0} max={100}
                      value={rule.minScore}
                      onChange={(e) => handleFieldChange(idx, 'minScore', parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      disabled={!canModify}
                      type="number" min={0} max={100}
                      value={rule.maxScore}
                      onChange={(e) => handleFieldChange(idx, 'maxScore', parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      disabled={!canModify}
                      type="number" step="0.1" min={0} max={5}
                      value={rule.point}
                      onChange={(e) => handleFieldChange(idx, 'point', parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      disabled={!canModify}
                      type="text"
                      value={rule.remark}
                      onChange={(e) => handleFieldChange(idx, 'remark', e.target.value)}
                      className="w-full max-w-[180px] px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {canModify && (
          <div className="flex gap-3 justify-end items-center pt-2">
            {savedSuccess && (
              <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                <Check size={14} />
                <span>Threshold changes applied live!</span>
              </span>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              Apply Grading Changes
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
