import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FileSpreadsheet, PlusCircle, CheckCircle, AlertCircle, Sparkles, HelpCircle, Lock, Edit, Check } from 'lucide-react';

export default function ExaminationModule() {
  const { 
    dbStudents, dbCourses, dbExaminationScores, dbSessions, dbProgrammes,
    addExamScoreDB, addExamScoresBulkDB, deleteExamScoreDB, setDbExaminationScores, currentUser 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'approval'>('single');

  // Single Entry Form state
  const [sessionId, setSessionId] = useState(dbSessions[0]?.id || '');
  const [programmeId, setProgrammeId] = useState(dbProgrammes[0]?.id || '');
  const [semester, setSemester] = useState<'First' | 'Second'>('First');
  
  const filteredStudents = dbStudents.filter(s => s.programmeId === programmeId);
  const filteredCourses = dbCourses.filter(c => c.programmeId === programmeId && c.semester === semester);
  
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  
  const [score, setScore] = useState('0');

  // Bulk Entry form state
  const [csvText, setCsvText] = useState('');
  const [bulkStatus, setBulkStatus] = useState<{ success: number; errors: string[] } | null>(null);

  // Auto Calculations as you type (live feedback)
  const scoreVal = parseFloat(score) || 0;

  const getLiveGrade = (score: number) => {
    if (score >= 70) return { grade: 'A', point: '4.00', remark: 'Passed (Distinction)', text: 'text-emerald-600' };
    if (score >= 60) return { grade: 'B', point: '3.00', remark: 'Passed (Upper Credit)', text: 'text-blue-600' };
    if (score >= 50) return { grade: 'C', point: '2.00', remark: 'Passed (Lower Credit)', text: 'text-amber-600' };
    if (score >= 45) return { grade: 'D', point: '1.00', remark: 'Passed (Pass)', text: 'text-slate-600' };
    return { grade: 'F', point: '0.00', remark: 'Failed', text: 'text-rose-600' };
  };

  const liveMetrics = getLiveGrade(scoreVal);

  // Process Single Score Submission
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseId) {
      alert('Please select both a Student and a Course.');
      return;
    }

    // Bounds checking
    if (scoreVal < 0 || scoreVal > 100) {
      alert('Score exceeds maximum limits (100).');
      return;
    }

    try {
      addExamScoreDB({
        studentId,
        courseId,
        sessionId,
        semester,
        score: scoreVal
      });
      alert('Examination score recorded successfully!');
      // Reset marks
      setScore('0');
    } catch (err) {
      alert('Failed to record score.');
    }
  };

  // Process Bulk Scores Submission with complete verification loop
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    const rows = csvText.trim().split('\n');
    const startIdx = rows[0].toLowerCase().includes('examnumber') || rows[0].toLowerCase().includes('regnumber') ? 1 : 0;
    const recordsToImport: any[] = [];
    const errors: string[] = [];

    for (let i = startIdx; i < rows.length; i++) {
      const row = rows[i];
      if (!row.trim()) continue;

      const cols = row.split(',').map(s => s.trim().replace(/^"|"$/g, ''));

      if (cols.length < 7) {
        errors.push(`Row ${i + 1}: Insufficient columns. Format must be: Exam Number, Student Name, Programme, Course Code, Course Title, Credit Unit, Score`);
        continue;
      }

      const regNoInput = cols[0];
      const courseCodeInput = cols[3];
      const scoreInput = parseFloat(cols[6]) || 0;

      // Find relational IDs
      const student = dbStudents.find(s => s.registrationNumber.toUpperCase() === regNoInput.toUpperCase());
      const course = dbCourses.find(c => c.courseCode.toUpperCase() === courseCodeInput.toUpperCase());

      if (!student) {
        errors.push(`Row ${i + 1}: Student with Exam No "${regNoInput}" does not exist in the students database.`);
        continue;
      }
      if (!course) {
        errors.push(`Row ${i + 1}: Course with Code "${courseCodeInput}" does not exist in the courses database.`);
        continue;
      }

      recordsToImport.push({
        studentId: student.id,
        courseId: course.id,
        score: scoreInput
      });
    }

    if (recordsToImport.length > 0) {
      addExamScoresBulkDB(recordsToImport);
      setBulkStatus({
        success: recordsToImport.length,
        errors
      });
      setCsvText('');
    } else {
      setBulkStatus({ success: 0, errors });
    }
  };

  const handleApprove = (id: string) => {
    setDbExaminationScores(prev => prev.map(s => s.id === id ? { ...s, status: 'Approved' } : s));
  };
  
  const handleLock = (id: string) => {
    setDbExaminationScores(prev => prev.map(s => s.id === id ? { ...s, status: 'Locked' } : s));
  };

  // Verify Active Session Permissions
  const canModify = currentUser?.role === 'Super Administrator' || currentUser?.role === 'Examination Officer';

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Tab Switcher */}
      <div className="border-b border-slate-100 flex gap-4">
        <button
          onClick={() => setActiveTab('single')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${activeTab === 'single' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Single Mark Entry
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${activeTab === 'bulk' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Bulk Copy-Paste Marks Upload
        </button>
        <button
          onClick={() => setActiveTab('approval')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${activeTab === 'approval' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Approvals & Locks
        </button>
      </div>

      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6 flex items-center gap-2">
              <PlusCircle size={16} className="text-blue-600" />
              <span>Enter Course Mark Sheet</span>
            </h3>

            {!canModify && (
              <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold rounded-xl mb-6">
                READ-ONLY MODE: Your user session role does not have authorization to write or save scores.
              </div>
            )}

            <form onSubmit={handleSingleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Academic Session</label>
                  <select
                    disabled={!canModify} value={sessionId} onChange={(e) => setSessionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    {dbSessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Programme</label>
                  <select
                    disabled={!canModify} value={programmeId} onChange={(e) => setProgrammeId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    {dbProgrammes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Semester</label>
                  <select
                    disabled={!canModify} value={semester} onChange={(e) => setSemester(e.target.value as 'First' | 'Second')}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    <option value="First">First Semester</option>
                    <option value="Second">Second Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Student</label>
                  <select
                    disabled={!canModify} value={studentId} onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    <option value="">Select Student</option>
                    {filteredStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.registrationNumber})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Course</label>
                  <select
                    disabled={!canModify} value={courseId} onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    <option value="">Select Course</option>
                    {filteredCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.courseCode}: {c.courseTitle}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="col-span-2">
                  <label className="block text-[9px] uppercase font-bold text-[#3b82f6] mb-1">Total Score (Max 100)</label>
                  <input
                    disabled={!canModify} type="number" min={0} max={100} step="0.5" value={score} onChange={(e) => setScore(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-black font-mono rounded-xl border border-blue-200 focus:outline-none bg-blue-50/30"
                  />
                </div>
              </div>

              {canModify && (
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm"
                  >
                    Save Grade Entry
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                <Sparkles size={16} className="text-amber-500" />
                <span>Live Computation Preview</span>
              </h3>

              <div className="space-y-4 font-bold text-xs text-slate-500">
                <div className="flex justify-between items-center pb-2.5 border-b-2 border-double border-slate-200 text-sm py-1.5 text-slate-800">
                  <span>Score:</span>
                  <span className="font-black font-mono text-blue-700 text-lg">{scoreVal} / 100</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center space-y-1 mt-6">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Grade</span>
              <span className={`text-4xl font-black block font-mono ${liveMetrics.text}`}>{liveMetrics.grade}</span>
              <span className="text-[10px] font-bold text-slate-600 uppercase block tracking-wider mt-1">{liveMetrics.remark}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed font-semibold">
            <span className="text-slate-700 uppercase font-black flex items-center gap-1 mb-2">
              <HelpCircle size={14} className="text-blue-500" />
              <span>Bulk Marks Sheet Paste Guidelines:</span>
            </span>
            <p className="mb-2">
              Copy your marks spreadsheet data directly, paste it inside the textarea below, and submit. Ensure columns are exactly as shown below:
            </p>
            <span className="font-mono text-slate-600 block bg-slate-100 p-2.5 rounded border border-slate-200 select-all overflow-x-auto leading-tight whitespace-nowrap">
              Exam Number,Student Name,Programme,Course Code,Course Title,Credit Unit,Score<br />
              DITEM/DICT/2026/0045,Ahmad Musa,DICT,DICT 101,Introduction to Computing,3,80.5<br />
              DITEM/DICT/2026/0012,Sarah Jones,DICT,DICT 101,Introduction to Computing,3,65
            </span>
          </div>

          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">CSV Content Textbox</label>
              <textarea
                disabled={!canModify} required value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={7}
                placeholder="Paste spreadsheets rows here..."
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
              ></textarea>
            </div>

            {bulkStatus && (
              <div className="space-y-2.5 text-xs font-bold">
                {bulkStatus.success > 0 && (
                  <div className="p-3.5 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span>Successfully processed and updated academic marks for {bulkStatus.success} courses!</span>
                  </div>
                )}
                {bulkStatus.errors.length > 0 && (
                  <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 font-black">
                      <AlertCircle size={16} />
                      <span>Process Warning - {bulkStatus.errors.length} Row Entries Rejected:</span>
                    </div>
                    <ul className="list-disc list-inside pl-1 text-[10px] space-y-0.5 font-semibold text-red-600 max-h-40 overflow-y-auto">
                      {bulkStatus.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {canModify && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
                >
                  <FileSpreadsheet size={15} />
                  <span>Verify and Process Marks</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}
      
      {activeTab === 'approval' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="p-3 font-bold">Student</th>
                  <th className="p-3 font-bold">Course</th>
                  <th className="p-3 font-bold">Score</th>
                  <th className="p-3 font-bold">Grade</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                {dbExaminationScores.map((score, i) => {
                  const student = dbStudents.find(s => s.id === score.studentId);
                  const course = dbCourses.find(c => c.id === score.courseId);
                  return (
                    <tr key={score.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        {student?.fullName}<br/>
                        <span className="text-[10px] text-slate-400 font-normal">{student?.registrationNumber}</span>
                      </td>
                      <td className="p-3">
                        {course?.courseCode}<br/>
                        <span className="text-[10px] text-slate-400 font-normal">{course?.courseTitle}</span>
                      </td>
                      <td className="p-3 font-mono">{score.totalScore}</td>
                      <td className="p-3">{score.grade}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          score.status === 'Locked' ? 'bg-slate-100 text-slate-600' : 
                          score.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {score.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {canModify && score.status !== 'Locked' && (
                          <div className="flex justify-end gap-2">
                            {score.status === 'Pending' && (
                              <button onClick={() => handleApprove(score.id)} className="bg-green-100 text-green-700 p-1.5 rounded hover:bg-green-200" title="Approve">
                                <Check size={14} />
                              </button>
                            )}
                            {(score.status === 'Pending' || score.status === 'Approved') && (
                              <button onClick={() => handleLock(score.id)} className="bg-slate-100 text-slate-700 p-1.5 rounded hover:bg-slate-200" title="Lock">
                                <Lock size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {dbExaminationScores.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No examination scores found.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
