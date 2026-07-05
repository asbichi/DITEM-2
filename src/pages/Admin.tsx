import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, FileSpreadsheet, 
  Settings, ShieldAlert, Key, LogOut, ChevronRight, FileText, 
  Award, Printer, Download, Eye, X, RefreshCw, Sparkles
} from 'lucide-react';

import DashboardHub from '../components/admin/DashboardHub';
import StudentRegistrar from '../components/admin/StudentRegistrar';
import CourseManager from '../components/admin/CourseManager';
import ExaminationModule from '../components/admin/ExaminationModule';
import GradingCustoms from '../components/admin/GradingCustoms';
import AuditLedger from '../components/admin/AuditLedger';
import SqlConsole from '../components/admin/SqlConsole';

import PrintableTranscript from '../components/PrintableTranscript';
import PrintableCertificate from '../components/PrintableCertificate';
import { logoBase64 } from '../components/logoData';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type TabType = 'dashboard' | 'students' | 'courses' | 'examination' | 'grading' | 'transcripts' | 'certificates' | 'audit' | 'sql';

export default function Admin() {
  const navigate = useNavigate();
  const { 
    currentUser, loginUser, logoutUser, enable2FA,
    dbStudents, dbCourses, dbTranscripts, dbCertificates,
    dbProgrammes, dbDepartments, dbSessions,
    addTranscriptDB, autoPopulateDemoScores, addCertificateDB, updateCertificateStatusDB,
    getStudentCalculatedGPA, logActivity
  } = useAppContext();

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Interactive Login simulation states (for users arriving directly on /admin)
  const [emailInput, setEmailInput] = useState('abdullahibichishuaib.abs@gmail.com');
  const [roleInput, setRoleInput] = useState('Super Administrator');

  // Preview & Printing state
  const [previewingStudentId, setPreviewingStudentId] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<'transcript' | 'certificate' | null>(null);

  // PDF Generation loading feedback state
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // If user is not logged in, render a luxury credentials entry and session initializer
  if (!currentUser) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      loginUser(emailInput, roleInput);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl border border-white/10 p-8 text-white">
          <div className="text-center mb-8">
            <img 
              src={logoBase64} 
              alt="DITEM Logo" 
              className="h-20 w-auto mx-auto mb-4 object-contain"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">DITEM Registrar Portal</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Institutional Ledger Engine</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Administrative Email Address</label>
              <input
                type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Authorized Portal Role</label>
              <select
                value={roleInput} onChange={(e) => setRoleInput(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-white/10 bg-slate-800 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Super Administrator">Super Administrator (All Access)</option>
                <option value="Examination Officer">Examination Officer (Courses, Scores, Rules)</option>
                <option value="Registrar">Registrar (Registry, Degrees, Signatures)</option>
                <option value="Data Entry Officer">Data Entry Officer (Register, Add Courses)</option>
                <option value="Student">Student (View Only Records)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Initialize Session Securely
            </button>
          </form>

          {/* Quick switcher labels */}
          <div className="mt-8 border-t border-white/10 pt-5 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-3">Quick tester presets:</span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                { r: 'Super Administrator', e: 'abdullahibichishuaib.abs@gmail.com', label: 'Admin' },
                { r: 'Examination Officer', e: 'examofficer@ditem.edu', label: 'Exam' },
                { r: 'Registrar', e: 'registrar@ditem.edu', label: 'Registrar' },
                { r: 'Data Entry Officer', e: 'dataentry@ditem.edu', label: 'Clerk' },
                { r: 'Student', e: 'student@ditem.edu', label: 'Student' }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => { setEmailInput(preset.e); setRoleInput(preset.r); }}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 px-2 py-1 rounded text-[9px] font-bold border border-white/5 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Compile high resolution single-page A4 PDF ---
  const downloadDocumentAsPDF = async (elementId: string, docName: string, orientation: 'portrait' | 'landscape' = 'portrait') => {
    setGeneratingPdf(true);
    const element = document.getElementById(elementId);
    if (!element) {
      setGeneratingPdf(false);
      return;
    }
    
    // Temporarily hide theme selectors or close buttons
    const styleSelectors = element.querySelector('.print\\:hidden');
    if (styleSelectors) (styleSelectors as HTMLElement).style.display = 'none';

    // Save current styling to restore it post-render
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    const originalHeight = element.style.height;
    const originalTransform = element.style.transform;

    // Standardize viewport capture sizing
    if (orientation === 'portrait') {
      element.style.width = '840px';
      element.style.maxWidth = '840px';
      element.style.height = 'auto';
    } else {
      element.style.width = '1120px';
      element.style.maxWidth = '1120px';
      element.style.height = '792px';
    }
    element.style.transform = 'none';

    try {
      // Compile DOM to clean, high-density Canvas representation
      const canvas = await html2canvas(element, { 
        scale: 2.0, 
        useCORS: true, 
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4'
      });
      const width = orientation === 'portrait' ? 210 : 297;
      const height = orientation === 'portrait' ? 297 : 210;

      pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
      
      try {
        pdf.save(`${docName}_${Date.now()}.pdf`);
      } catch (e) {
        console.warn('Standard pdf.save failed, trying blob URL fallback...', e);
        try {
          const pdfBlob = pdf.output('blob');
          const blobUrl = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${docName}_${Date.now()}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        } catch (e2) {
          console.error('Blob URL save failed, using fallback printer dialog', e2);
          window.print();
        }
      }

      logActivity(currentUser.id, 'PDF Downloaded', `Successfully compiled and downloaded ${docName} as high-res single-page PDF.`);
    } catch (err) {
      console.error('Failed to compile printable PDF', err);
      alert('Error generating PDF: ' + String(err) + '\n\nIf you are in the preview window, downloads might be blocked. Please open the app in a new tab (top right icon) and try again.');
      window.print();
    } finally {
      // Revert styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.height = originalHeight;
      element.style.transform = originalTransform;

      if (styleSelectors) (styleSelectors as HTMLElement).style.display = '';
      setGeneratingPdf(false);
    }
  };

  // Compile active tab side list matching user authorization permissions
  const menuItems: { id: TabType; label: string; icon: any; roles?: string[] }[] = [
    { id: 'dashboard', label: 'Analytics Hub', icon: LayoutDashboard },
    { id: 'students', label: 'Student Registry', icon: Users, roles: ['Super Administrator', 'Registrar', 'Data Entry Officer'] },
    { id: 'courses', label: 'Course Catalogues', icon: BookOpen, roles: ['Super Administrator', 'Examination Officer', 'Data Entry Officer'] },
    { id: 'examination', label: 'Examinations Module', icon: FileSpreadsheet, roles: ['Super Administrator', 'Examination Officer'] },
    { id: 'grading', label: 'Grading Customizer', icon: Settings, roles: ['Super Administrator', 'Examination Officer'] },
    { id: 'transcripts', label: 'Academic Transcripts', icon: FileText, roles: ['Super Administrator', 'Registrar', 'Examination Officer', 'Data Entry Officer'] },
    { id: 'certificates', label: 'Degree Diplomas', icon: Award, roles: ['Super Administrator', 'Registrar', 'Examination Officer', 'Data Entry Officer'] },
    { id: 'audit', label: 'Security Auditing', icon: ShieldAlert, roles: ['Super Administrator'] },
    { id: 'sql', label: 'Database Backup & SQL', icon: Key, roles: ['Super Administrator'] },
  ];

  const allowedMenuItems = menuItems.filter(item => !item.roles || item.roles.includes(currentUser.role));

  // Auto fallback tab if user changes role and previous tab becomes unauthorized
  if (currentUser.role !== 'Super Administrator' && !allowedMenuItems.some(item => item.id === activeTab)) {
    setActiveTab('dashboard');
  }

  // Mapper to translate relational Student and scores to standard Printable props
  const getMappedDocumentProps = (studentIdInput: string) => {
    const std = dbStudents.find(s => s.id === studentIdInput);
    if (!std) return null;

    const stdScores = getStudentCalculatedGPA(std.id);
    const transcriptCourses = dbCourses.map(crs => {
      // Find corresponding exam score record
      const matchScore = useAppContext().dbExaminationScores.find(e => e.studentId === std.id && e.courseId === crs.id);
      return {
        id: crs.id,
        code: crs.courseCode,
        title: crs.courseTitle,
        creditUnits: String(crs.creditUnit),
        marks: matchScore ? String(matchScore.totalScore) : '',
        grade: matchScore ? matchScore.grade : '-',
        points: matchScore ? matchScore.qualityPoints?.toFixed(2) || (matchScore.gradePoint * crs.creditUnit).toFixed(2) : '-',
        remarks: matchScore ? matchScore.remark : '-'
      };
    }).filter(tc => tc.marks !== ''); // only show courses with recorded scores

    // Find Certificate and Transcript numbers
    const certRecord = dbCertificates.find(c => c.studentId === std.id);
    const transcriptRecord = dbTranscripts.find(t => t.studentId === std.id);

    return {
      studentName: std.fullName,
      registrationNumber: std.registrationNumber,
      admissionNumber: std.admissionNumber,
      matricNumber: std.matricNumber,
      studentPhotograph: std.studentPhotograph,
      programme: dbProgrammes.find(p => p.id === std.programmeId)?.name || 'DICT',
      department: dbDepartments.find(d => d.id === std.departmentId)?.name || 'CSIT',
      duration: dbProgrammes.find(p => p.id === std.programmeId)?.duration || '3 Months',
      sessionBatch: dbSessions.find(s => s.id === std.sessionId)?.name || '2025/2026',
      graduationYear: std.graduationYear,
      courses: transcriptCourses,
      gpa: stdScores.gpa.toFixed(2),
      cgpa: stdScores.cgpa.toFixed(2),
      totalCreditUnits: String(stdScores.totalCredits),
      creditsPassed: String(stdScores.creditsPassed),
      creditsFailed: String(stdScores.creditsFailed),
      verificationCode: certRecord?.verificationCode || 'DITEM-SEC-925A1B',
      transcriptNumber: transcriptRecord?.transcriptNumber || 'TRANS/2026/000001',
      dateOfIssue: certRecord?.dateOfIssue || new Date().toISOString().split('T')[0]
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative z-10 font-sans text-slate-800">
      
      {/* 1. Portal Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0f172a] text-white flex flex-col justify-between p-5 md:min-h-screen relative z-10 print:hidden shrink-0">
        <div className="space-y-6">
          
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            <img 
              src={logoBase64} 
              alt="DITEM Logo" 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-extrabold text-lg text-white tracking-tighter block leading-none">DITEM</span>
              <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold block mt-0.5">Registrar Panel</span>
            </div>
          </div>

          {/* User Active Session Badge Profile */}
          <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Active Session</span>
            </div>
            <span className="block text-xs font-black truncate max-w-full uppercase">{currentUser.name}</span>
            <span className="text-[8px] text-amber-400 font-black tracking-wider uppercase bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded mt-1.5 inline-block">
              {currentUser.role}
            </span>
          </div>

          {/* Navigation links list */}
          <nav className="space-y-1">
            {allowedMenuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setPreviewingStudentId(null); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={12} className={`opacity-40 ${isSelected ? 'translate-x-0.5' : ''}`} />
                </button>
              );
            })}
          </nav>

        </div>

        {/* Foot of sidebar: MFA toggler & Session closer */}
        <div className="space-y-4 pt-6 border-t border-white/10 mt-6">
          
          {/* Security Mfa switch */}
          <div className="flex items-center justify-between text-xs font-bold bg-white/5 p-2 rounded-xl">
            <span className="text-slate-400 text-[10px]">Portal 2FA Security</span>
            <button
              onClick={() => enable2FA(currentUser.id, !currentUser.mfaEnabled)}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex ${currentUser.mfaEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-600 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm inline-block"></span>
            </button>
          </div>

          <button
            onClick={() => { logoutUser(); navigate('/'); }}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span>Terminate Session</span>
          </button>
        </div>

      </aside>

      {/* 2. Main Portal Stage View */}
      <main className="flex-grow p-6 md:p-8 space-y-6 relative z-10 min-w-0 max-h-screen overflow-y-auto">
        
        {/* Dynamic header title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 print:hidden">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">
              {allowedMenuItems.find(i => i.id === activeTab)?.label || 'Administration Console'}
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-1 tracking-widest leading-none">
              DITEM Institutional Registry Systems
            </p>
          </div>

          {/* Quick instructions indicator */}
          <div className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Relational database fully integrated.</span>
          </div>
        </div>

        {/* View-Only Student Dashboard (Renders if user is logging in as Student role) */}
        {currentUser.role === 'Student' ? (
          <div className="space-y-6">
            
            {/* Quick Greeting */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute inset-0 bg-no-repeat bg-center opacity-[0.05]" style={{ backgroundImage: `url(${logoBase64})` }}></div>
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight relative z-10">Welcome to your Student Academic Ledger, {currentUser.name}</h2>
              <p className="text-xs text-blue-200 mt-1 relative z-10">Query, verify, print, and download your verified transcripts and graduation certificates live.</p>
            </div>

            {/* List of default students they can preview (for demo simplicity, student can preview st1 or st2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dbStudents.slice(0, 2).map((std) => (
                <div key={std.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <img src={std.studentPhotograph} alt={std.fullName} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                    <div>
                      <span className="block font-black text-slate-800 uppercase">{std.fullName}</span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{std.registrationNumber}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => { setPreviewingStudentId(std.id); setDocumentType('transcript'); }}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                    >
                      View Transcript
                    </button>
                    <button
                      onClick={() => { setPreviewingStudentId(std.id); setDocumentType('certificate'); }}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                    >
                      View Diploma
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* Standard Administrator view layouts */
          !previewingStudentId && (
            <div className="space-y-6">
              {activeTab === 'dashboard' && <DashboardHub />}
              {activeTab === 'students' && <StudentRegistrar />}
              {activeTab === 'courses' && <CourseManager />}
              {activeTab === 'examination' && <ExaminationModule />}
              {activeTab === 'grading' && <GradingCustoms />}
              {activeTab === 'audit' && <AuditLedger />}
              {activeTab === 'sql' && <SqlConsole />}

              {/* Documents Registries (Transcripts and Certificates) */}
              {(activeTab === 'transcripts' || activeTab === 'certificates') && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      {activeTab === 'transcripts' ? 'Transcript Distribution Registry' : 'Degree Diplomas Distribution Registry'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeTab === 'transcripts' 
                        ? 'Select a student record to preview, verify, customize, and print their official institutional academic transcript sheet.'
                        : 'Issue degree diplomas, select beautiful calligraphic themes, add verification codes, and download high-resolution certificates.'
                      }
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-semibold text-slate-600">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 text-[10px] uppercase font-bold">
                          <th className="py-3 px-5">Student profile</th>
                          <th className="py-3 px-5">Registration No</th>
                          <th className="py-3 px-5">Standing CGPA</th>
                          <th className="py-3 px-5 text-center">Status</th>
                          <th className="py-3 px-5 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dbStudents.map((std) => {
                          const hasScores = useAppContext().dbExaminationScores.some(e => e.studentId === std.id);
                          const isTranscriptIssued = dbTranscripts.some(t => t.studentId === std.id);
                          const isCertIssued = dbCertificates.some(c => c.studentId === std.id);
                          const calc = getStudentCalculatedGPA(std.id);

                          return (
                            <tr key={std.id} className="hover:bg-slate-50/40">
                              <td className="py-3 px-5 flex items-center gap-3">
                                <img src={std.studentPhotograph} alt={std.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                                <span className="font-extrabold text-slate-900 uppercase">{std.fullName}</span>
                              </td>
                              <td className="py-3 px-5 font-mono font-bold">{std.registrationNumber}</td>
                              <td className="py-3 px-5">
                                <span className="font-bold text-slate-700">{calc.cgpa.toFixed(2)}</span>
                                <span className="block text-[9px] font-black text-slate-400 uppercase mt-0.5">{calc.classification}</span>
                              </td>
                              <td className="py-3 px-5 text-center">
                                {activeTab === 'transcripts' ? (
                                  isTranscriptIssued ? (
                                    <span className="bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wide">Issued</span>
                                  ) : (
                                    <span className="bg-slate-100 text-slate-500 font-bold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wide">Not Generated</span>
                                  )
                                ) : (
                                  isCertIssued ? (
                                    <span className="bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wide">Issued / Sealed</span>
                                  ) : (
                                    <span className="bg-slate-100 text-slate-500 font-bold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wide">Not Issued</span>
                                  )
                                )}
                              </td>
                              <td className="py-3 px-5 text-center">
                                <div className="flex gap-2 justify-center">
                                  {activeTab === 'transcripts' ? (
                                    <>
                                      {!isTranscriptIssued ? (
                                        <div className="flex gap-1.5">
                                          <button
                                            onClick={() => addTranscriptDB(std.id, currentUser.name)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm"
                                          >
                                            Generate Serial
                                          </button>
                                          {!hasScores && (
                                            <button
                                              onClick={() => {
                                                autoPopulateDemoScores(std.id);
                                                alert(`Successfully auto-populated realistic exam grades and issued transcript for ${std.fullName}!`);
                                              }}
                                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1"
                                              title="Auto-populate mock grades for quick demonstration"
                                            >
                                              <Sparkles size={11} />
                                              <span>Quick Gen</span>
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        !hasScores && (
                                          <button
                                            onClick={() => {
                                              autoPopulateDemoScores(std.id);
                                              alert(`Successfully auto-populated realistic exam grades for ${std.fullName}!`);
                                            }}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1"
                                            title="Auto-populate mock grades for quick demonstration"
                                          >
                                            <Sparkles size={11} />
                                            <span>Populate Grades</span>
                                          </button>
                                        )
                                      )}
                                      <button
                                        onClick={() => { setPreviewingStudentId(std.id); setDocumentType('transcript'); }}
                                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg"
                                        title="Preview and Print Transcript"
                                      >
                                        <Eye size={14} />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      {!isCertIssued ? (
                                        <div className="flex gap-1.5">
                                          <button
                                            onClick={() => addCertificateDB(std.id, currentUser.name)}
                                            className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm"
                                          >
                                            Issue Diploma
                                          </button>
                                          {!hasScores && (
                                            <button
                                              onClick={() => {
                                                autoPopulateDemoScores(std.id);
                                                addCertificateDB(std.id, currentUser.name);
                                                alert(`Successfully auto-populated realistic exam grades and issued degree diploma for ${std.fullName}!`);
                                              }}
                                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1"
                                              title="Auto-populate mock grades and issue diploma for quick demonstration"
                                            >
                                              <Sparkles size={11} />
                                              <span>Quick Gen</span>
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        !hasScores && (
                                          <button
                                            onClick={() => {
                                              autoPopulateDemoScores(std.id);
                                              alert(`Successfully auto-populated realistic exam grades for ${std.fullName}!`);
                                            }}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1"
                                            title="Auto-populate mock grades for quick demonstration"
                                          >
                                            <Sparkles size={11} />
                                            <span>Populate Grades</span>
                                          </button>
                                        )
                                      )}
                                      <button
                                        onClick={() => { setPreviewingStudentId(std.id); setDocumentType('certificate'); }}
                                        className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg"
                                        title="Style and Print Certificate"
                                      >
                                        <Eye size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* 3. Document Printable Stage Overlay (Renders when a preview is triggered) */}
        {previewingStudentId && documentType && (
          <div className="space-y-6 animate-fadeIn pb-20">
            
            {/* Context Tool-dock Toolbar (Hidden in print mode) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 print:hidden relative z-10">
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setPreviewingStudentId(null); setDocumentType(null); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
                >
                  ✕
                </button>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block leading-none">Document Preview Console</span>
                  <span className="text-sm font-black text-slate-800 uppercase mt-1 block">
                    {documentType === 'transcript' ? 'Official Academic Transcript' : 'Verified Degree Diploma'}
                  </span>
                </div>
              </div>

              {/* Custom controls depending on document */}
              <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  <Printer size={13} />
                  <span>Send to Printer</span>
                </button>

                <button
                  disabled={generatingPdf}
                  onClick={() => {
                    const orientation = documentType === 'transcript' ? 'portrait' : 'landscape';
                    const docTitle = documentType === 'transcript' ? 'Transcript' : 'Degree_Diploma';
                    downloadDocumentAsPDF('printable-stage-box', docTitle, orientation);
                  }}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm disabled:bg-blue-400"
                >
                  {generatingPdf ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <Download size={13} />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>

              </div>

            </div>

            {/* Friendly sandbox warning for iframe users */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5 shadow-sm print:hidden max-w-4xl mx-auto w-full">
              <span className="text-base leading-none">💡</span>
              <div>
                <strong className="font-bold">Iframe Sandbox Security Notice:</strong> 
                <p className="mt-1 leading-normal">
                  Chrome/Safari standard security sandboxes inside browser preview frames block direct file downloads. If clicking "Download PDF" does not trigger a download window, please open this app in a 
                  <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="mx-1 font-bold underline hover:text-amber-950">
                    New Tab (Direct URL)
                  </a>
                  and try again. Direct downloads are fully active.
                </p>
              </div>
            </div>

            {/* Document Stage Wrapper (Perfect aspect-ratio centering) */}
            <div className="flex justify-center w-full overflow-x-auto bg-slate-200/50 p-6 rounded-2xl border border-slate-300/40">
              <div id="printable-stage-box" className="bg-white shrink-0 shadow-lg">
                {documentType === 'transcript' ? (
                  getMappedDocumentProps(previewingStudentId) && (
                    <PrintableTranscript data={getMappedDocumentProps(previewingStudentId)!} />
                  )
                ) : (
                  getMappedDocumentProps(previewingStudentId) && (
                    <PrintableCertificate 
                      data={getMappedDocumentProps(previewingStudentId)!}
                    />
                  )
                )}
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
