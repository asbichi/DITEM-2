import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Users, GraduationCap, BookOpen, Award, FileText, TrendingUp, ShieldAlert } from 'lucide-react';

export default function DashboardHub() {
  const { dbStudents, dbCourses, dbCertificates, dbTranscripts, getStudentCalculatedGPA } = useAppContext();

  // Compute analytics
  const totalStudents = dbStudents.length;
  const totalCourses = dbCourses.length;
  const totalCerts = dbCertificates.length;
  const totalTranscripts = dbTranscripts.length;

  // Compute graduation classification totals
  const classifications = {
    DISTINCTION: 0,
    'UPPER CREDIT': 0,
    'LOWER CREDIT': 0,
    PASS: 0,
    FAILED: 0
  };

  dbStudents.forEach(std => {
    const metrics = getStudentCalculatedGPA(std.id);
    const cls = metrics.classification as keyof typeof classifications;
    if (classifications[cls] !== undefined) {
      classifications[cls]++;
    }
  });

  const totalGraduates = classifications.DISTINCTION + classifications['UPPER CREDIT'] + classifications['LOWER CREDIT'] + classifications.PASS;

  // Prepare custom SVG data charts
  const classificationLabels = Object.keys(classifications);
  const classificationValues = Object.values(classifications);
  const maxClsVal = Math.max(...classificationValues, 1);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Students Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Students</span>
            <span className="text-2xl font-black text-slate-800 font-mono">{totalStudents}</span>
          </div>
        </div>

        {/* Total Graduates Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <GraduationCap size={24} />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Graduates</span>
            <span className="text-2xl font-black text-slate-800 font-mono">{totalGraduates}</span>
          </div>
        </div>

        {/* Courses Catalog Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Active Study Courses</span>
            <span className="text-2xl font-black text-slate-800 font-mono">{totalCourses}</span>
          </div>
        </div>

        {/* Certificates Issued Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Issued Degree Certificates</span>
            <span className="text-2xl font-black text-slate-800 font-mono">{totalCerts}</span>
          </div>
        </div>

      </div>

      {/* Two-Column Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Honors Classification Custom SVG Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <span>Honors Classification Distribution</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* SVG Donut Chart representation */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                
                {/* Simulated split rings */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" 
                  stroke="#10b981" strokeWidth="3" 
                  strokeDasharray={`${(classifications.DISTINCTION / (totalStudents || 1)) * 100} ${100 - ((classifications.DISTINCTION / (totalStudents || 1)) * 100)}`}
                  strokeDashoffset="0"
                />
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" 
                  stroke="#3b82f6" strokeWidth="3" 
                  strokeDasharray={`${(classifications['UPPER CREDIT'] / (totalStudents || 1)) * 100} ${100 - ((classifications['UPPER CREDIT'] / (totalStudents || 1)) * 100)}`}
                  strokeDashoffset={-((classifications.DISTINCTION / (totalStudents || 1)) * 100)}
                />
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" 
                  stroke="#f59e0b" strokeWidth="3" 
                  strokeDasharray={`${(classifications['LOWER CREDIT'] / (totalStudents || 1)) * 100} ${100 - ((classifications['LOWER CREDIT'] / (totalStudents || 1)) * 100)}`}
                  strokeDashoffset={-(((classifications.DISTINCTION + classifications['UPPER CREDIT']) / (totalStudents || 1)) * 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 font-mono">{(totalStudents > 0) ? Math.round((totalGraduates / totalStudents) * 100) : 0}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Grad Rate</span>
              </div>
            </div>

            {/* Legend checklist */}
            <div className="flex-grow space-y-3.5 w-full">
              {[
                { name: 'Distinction', count: classifications.DISTINCTION, color: 'bg-emerald-500', text: 'text-emerald-700' },
                { name: 'Upper Credit', count: classifications['UPPER CREDIT'], color: 'bg-blue-500', text: 'text-blue-700' },
                { name: 'Lower Credit', count: classifications['LOWER CREDIT'], color: 'bg-amber-500', text: 'text-amber-700' },
                { name: 'Pass Only', count: classifications.PASS, color: 'bg-slate-400', text: 'text-slate-600' },
                { name: 'Failed', count: classifications.FAILED, color: 'bg-rose-500', text: 'text-rose-600' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono">{totalStudents > 0 ? Math.round((item.count / totalStudents) * 100) : 0}%</span>
                    <span className={`font-black font-mono w-6 text-right ${item.text}`}>{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance & Ledger Status Column */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <span>Academic Transcript Logs</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100">
                <span>Active Metric Parameters</span>
                <span>Active Status Check</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600">Total Transcripts Generated</span>
                <span className="font-mono text-slate-800">{totalTranscripts}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600">Verification Engine Security</span>
                <span className="text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Cryptographic SSL Live
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600">National NBTE Grading Code</span>
                <span className="font-mono text-slate-800">4.0 Cumulative GP Scale</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl flex items-start gap-3">
            <ShieldAlert size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Institutional Security Directive:</strong> Changes made to individual examination marks will automatically re-compute the cumulative CGPA on transcripts, which in turn live-updates the degree diploma classification. Ensure all entries are double-checked.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
