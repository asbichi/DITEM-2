import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, BookOpen, Trash2, Edit2, X, PlusCircle, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

export default function CourseManager() {
  const { 
    dbCourses, dbDepartments, dbProgrammes, 
    addCourseDB, updateCourseDB, deleteCourseDB, currentUser 
  } = useAppContext();

  // Dialog states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Course Form state
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [creditUnit, setCreditUnit] = useState(3);
  const [semester, setSemester] = useState<'First' | 'Second'>('First');
  const [level, setLevel] = useState('ND1');
  const [deptId, setDeptId] = useState(dbDepartments[0]?.id || '');
  const [progId, setProgId] = useState(dbProgrammes[0]?.id || '');

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: number; errors: string[] } | null>(null);

  const resetForm = () => {
    setCourseCode('');
    setCourseTitle('');
    setCreditUnit(3);
    setSemester('First');
    setLevel('ND1');
    setEditingCourseId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseTitle) {
      alert('Course Code and Title are required.');
      return;
    }

    const payload = {
      courseCode: courseCode.toUpperCase(),
      courseTitle: courseTitle.trim(),
      creditUnit,
      semester,
      level,
      departmentId: deptId,
      programmeId: progId
    };

    if (editingCourseId) {
      updateCourseDB(editingCourseId, payload);
    } else {
      addCourseDB(payload);
    }

    resetForm();
    setShowAddModal(false);
  };

  const handleStartEdit = (crs: typeof dbCourses[0]) => {
    setEditingCourseId(crs.id);
    setCourseCode(crs.courseCode);
    setCourseTitle(crs.courseTitle);
    setCreditUnit(crs.creditUnit);
    setSemester(crs.semester);
    setLevel(crs.level);
    setDeptId(crs.departmentId);
    setProgId(crs.programmeId);
    setShowAddModal(true);
  };

  // Bulk CSV parsing and relational insertion
  const handleBulkCSVImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    const rows = csvText.trim().split('\n');
    let successCount = 0;
    const errors: string[] = [];

    const startIdx = rows[0].toLowerCase().includes('code') ? 1 : 0;

    for (let i = startIdx; i < rows.length; i++) {
      const row = rows[i];
      if (!row.trim()) continue;

      const cols = row.split(',').map(s => s.trim().replace(/^"|"$/g, ''));

      if (cols.length < 3) {
        errors.push(`Row ${i + 1}: Insufficient columns. Format must be: Code, Title, Credits, [Semester, Level]`);
        continue;
      }

      const codeVal = cols[0];
      const titleVal = cols[1];
      const credVal = parseInt(cols[2]) || 3;
      const semVal = (cols[3] || 'First') as 'First' | 'Second';
      const lvlVal = cols[4] || 'ND1';

      if (!codeVal || !titleVal) {
        errors.push(`Row ${i + 1}: Missing Course Code or Title.`);
        continue;
      }

      // Check if course code is already in database
      const isDuplicate = dbCourses.some(c => c.courseCode.toUpperCase() === codeVal.toUpperCase());
      if (isDuplicate) {
        errors.push(`Row ${i + 1}: Course Code ${codeVal} already exists in database.`);
        continue;
      }

      try {
        addCourseDB({
          courseCode: codeVal.toUpperCase(),
          courseTitle: titleVal,
          creditUnit: credVal,
          semester: semVal,
          level: lvlVal,
          departmentId: deptId || dbDepartments[0]?.id || '',
          programmeId: progId || dbProgrammes[0]?.id || ''
        });
        successCount++;
      } catch (err) {
        errors.push(`Row ${i + 1}: Failed to insert course.`);
      }
    }

    setImportStatus({ success: successCount, errors });
    setCsvText('');
    setTimeout(() => {
      if (successCount > 0 && errors.length === 0) {
        setShowImportModal(false);
        setImportStatus(null);
      }
    }, 4000);
  };

  const filteredCourses = dbCourses.filter(c => {
    const matchesSearch = c.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === '' || c.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  const canModify = currentUser?.role === 'Super Administrator' || currentUser?.role === 'Examination Officer' || currentUser?.role === 'Data Entry Officer';
  const canDelete = currentUser?.role === 'Super Administrator' || currentUser?.role === 'Examination Officer';

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Search and action headers */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by Code or Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
          >
            <option value="">All Departments</option>
            {dbDepartments.map(d => (
              <option key={d.id} value={d.id}>{d.code}</option>
            ))}
          </select>

          {canModify && (
            <>
              <button
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                <PlusCircle size={14} />
                <span>Add Course</span>
              </button>

              <button
                onClick={() => { setImportStatus(null); setShowImportModal(true); }}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                <FileSpreadsheet size={14} />
                <span>Bulk Import</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Courses table layout */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
                <th className="py-4 px-6">Course Code</th>
                <th className="py-4 px-6">Course Title</th>
                <th className="py-4 px-6 text-center">Credit Units</th>
                <th className="py-4 px-6">Semester</th>
                <th className="py-4 px-6">Level / Class</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">
                    No course records matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((crs) => {
                  const dept = dbDepartments.find(d => d.id === crs.departmentId);
                  return (
                    <tr key={crs.id} className="hover:bg-slate-50/40">
                      <td className="py-3 px-6 font-mono font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded select-all inline-block mt-1.5 ml-4">
                        {crs.courseCode}
                      </td>
                      <td className="py-3 px-6 text-slate-900 font-bold">
                        {crs.courseTitle}
                      </td>
                      <td className="py-3 px-6 text-center font-mono font-black text-blue-600">
                        {crs.creditUnit}
                      </td>
                      <td className="py-3 px-6">
                        <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded">
                          {crs.semester} Semester
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div>
                          <span className="block">{crs.level}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">{dept ? dept.code : 'CSIT'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex gap-2 justify-center">
                          {canModify ? (
                            <button
                              onClick={() => handleStartEdit(crs)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="Edit Course"
                            >
                              <Edit2 size={14} />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold italic">Read Only</span>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${crs.courseCode}? This will also wipe out any academic exam scores associated with this course!`)) {
                                  deleteCourseDB(crs.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Add/Edit modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <BookOpen size={16} className="text-blue-600" />
                <span>{editingCourseId ? 'Edit Course Details' : 'Register New Course'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Course Code *</label>
                <input
                  type="text" required value={courseCode} onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 uppercase"
                  placeholder="e.g. DICT 102"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Course Title *</label>
                <input
                  type="text" required value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  placeholder="e.g. Web Technologies"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Credit Units</label>
                  <input
                    type="number" min={1} max={6} value={creditUnit} onChange={(e) => setCreditUnit(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Semester</label>
                  <select
                    value={semester} onChange={(e) => setSemester(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    <option value="First">First</option>
                    <option value="Second">Second</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Level</label>
                  <select
                    value={level} onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    <option value="ND1">ND1</option>
                    <option value="ND2">ND2</option>
                    <option value="HND1">HND1</option>
                    <option value="HND2">HND2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department</label>
                  <select
                    value={deptId} onChange={(e) => setDeptId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    {dbDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Programme</label>
                  <select
                    value={progId} onChange={(e) => setProgId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    {dbProgrammes.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button" onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  {editingCourseId ? 'Save Changes' : 'Register Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Import CSV modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <FileSpreadsheet size={16} className="text-emerald-600" />
                <span>Bulk Courses CSV Import</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBulkCSVImport} className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-semibold">
                <span className="text-slate-700 uppercase font-bold block mb-1">Paste CSV Template format:</span>
                <span className="font-mono text-slate-600 block bg-slate-100 p-2 rounded border border-slate-200 overflow-x-auto select-all">
                  courseCode,courseTitle,creditUnit,semester,level<br />
                  DICT 205,Mobile App Development,4,First,ND2<br />
                  DICT 206,Cloud Computing Foundations,3,Second,ND2
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">CSV Text Content</label>
                <textarea
                  required value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={6}
                  placeholder="Paste course CSV rows here..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50/50"
                ></textarea>
              </div>

              {importStatus && (
                <div className="space-y-2 text-xs font-bold">
                  {importStatus.success > 0 && (
                    <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-2">
                      <CheckCircle size={16} />
                      <span>Successfully loaded {importStatus.success} new courses into registry!</span>
                    </div>
                  )}
                  {importStatus.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl space-y-1">
                      <div className="flex items-center gap-2 font-black">
                        <AlertCircle size={16} />
                        <span>Rejected {importStatus.errors.length} rows:</span>
                      </div>
                      <ul className="list-disc list-inside pl-1 text-[10px] space-y-0.5 font-semibold text-red-600">
                        {importStatus.errors.slice(0, 5).map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button" onClick={() => setShowImportModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  Process CSV Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
