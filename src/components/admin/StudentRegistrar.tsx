import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, UserPlus, FileSpreadsheet, Trash2, Edit2, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StudentRegistrar() {
  const { 
    dbStudents, dbDepartments, dbProgrammes, dbSessions, 
    addStudentDB, updateStudentDB, deleteStudentDB, currentUser 
  } = useAppContext();

  // Modal Toggles
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Individual Form Fields State
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [admNo, setAdmNo] = useState('');
  const [matNo, setMatNo] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [deptId, setDeptId] = useState(dbDepartments[0]?.id || '');
  const [progId, setProgId] = useState(dbProgrammes[0]?.id || '');
  const [sessId, setSessId] = useState(dbSessions[0]?.id || '');
  const [gradYear, setGradYear] = useState('2026');
  const [photograph, setPhotograph] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');

  // Bulk CSV Import state
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: number; errors: string[] } | null>(null);

  // Reset form helper
  const resetForm = () => {
    setFullName('');
    setRegNo('');
    setAdmNo('');
    setMatNo('');
    setDob('');
    setGender('Male');
    setState('');
    setLga('');
    setGradYear('2026');
    setEditingStudentId(null);
  };

  // Handle Add / Edit Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !regNo) {
      alert('Full Name and Exam Number are required.');
      return;
    }

    const payload = {
      fullName: fullName.toUpperCase(),
      registrationNumber: regNo.toUpperCase(),
      admissionNumber: admNo.toUpperCase() || `ADM/2026/${Math.floor(Math.random() * 9000 + 1000)}`,
      matricNumber: matNo.toUpperCase() || `MAT/DICT/2026/${Math.floor(Math.random() * 9000 + 1000)}`,
      studentPhotograph: photograph,
      dateOfBirth: dob || '2001-01-01',
      gender,
      state: state || 'Kaduna',
      localGovernment: lga || 'Kaduna North',
      departmentId: deptId,
      programmeId: progId,
      sessionId: sessId,
      graduationYear: gradYear
    };

    if (editingStudentId) {
      updateStudentDB(editingStudentId, payload);
    } else {
      addStudentDB(payload);
    }

    resetForm();
    setShowAddModal(false);
  };

  // Load selected student values into editor fields
  const handleStartEdit = (std: typeof dbStudents[0]) => {
    setEditingStudentId(std.id);
    setFullName(std.fullName);
    setRegNo(std.registrationNumber);
    setAdmNo(std.admissionNumber);
    setMatNo(std.matricNumber);
    setDob(std.dateOfBirth);
    setGender(std.gender);
    setState(std.state);
    setLga(std.localGovernment);
    setDeptId(std.departmentId);
    setProgId(std.programmeId);
    setSessId(std.sessionId);
    setGradYear(std.graduationYear);
    setPhotograph(std.studentPhotograph);
    setShowAddModal(true);
  };

  // Custom Bulk CSV parser
  const handleBulkCSVImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    const rows = csvText.trim().split('\n');
    let successCount = 0;
    const errors: string[] = [];

    // Skip header row if it contains descriptive words like 'fullName'
    const startIdx = rows[0].toLowerCase().includes('name') ? 1 : 0;

    for (let i = startIdx; i < rows.length; i++) {
      const row = rows[i];
      if (!row.trim()) continue;

      const cols = row.split(',').map(s => s.trim().replace(/^"|"$/g, '')); // basic csv quote strip

      if (cols.length < 2) {
        errors.push(`Row ${i + 1}: Insufficient column count. Must contain: FullName, ExamNo, [AdmNo, MatNo, Gender, State]`);
        continue;
      }

      const fNameVal = cols[0];
      const regNoVal = cols[1];
      const admNoVal = cols[2] || `ADM/2026/0${100 + i}`;
      const matNoVal = cols[3] || `MAT/DICT/2026/0${100 + i}`;
      const genderVal = cols[4] || 'Male';
      const stateVal = cols[5] || 'Kaduna';
      const dobVal = cols[6] || '2001-01-01';

      if (!fNameVal || !regNoVal) {
        errors.push(`Row ${i + 1}: Missing mandatory Full Name or Exam Number.`);
        continue;
      }

      // Check for duplicate Exam Number
      const isDuplicate = dbStudents.some(s => s.registrationNumber.toUpperCase() === regNoVal.toUpperCase());
      if (isDuplicate) {
        errors.push(`Row ${i + 1}: Exam Number ${regNoVal} is already taken.`);
        continue;
      }

      try {
        addStudentDB({
          fullName: fNameVal.toUpperCase(),
          registrationNumber: regNoVal.toUpperCase(),
          admissionNumber: admNoVal.toUpperCase(),
          matricNumber: matNoVal.toUpperCase(),
          studentPhotograph: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          dateOfBirth: dobVal,
          gender: genderVal,
          state: stateVal,
          localGovernment: 'Kaduna North',
          departmentId: deptId || dbDepartments[0]?.id || '',
          programmeId: progId || dbProgrammes[0]?.id || '',
          sessionId: sessId || dbSessions[0]?.id || '',
          graduationYear: gradYear || '2026'
        });
        successCount++;
      } catch (err) {
        errors.push(`Row ${i + 1}: Student record creation failed due to system error.`);
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

  // Filter students array based on search & filters
  const filteredStudents = dbStudents.filter(std => {
    const matchesSearch = std.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          std.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          std.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === '' || std.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Verify Role Actions (Registrar and SuperAdmin can modify/delete)
  const canModify = currentUser?.role === 'Super Administrator' || currentUser?.role === 'Registrar' || currentUser?.role === 'Data Entry Officer';
  const canDelete = currentUser?.role === 'Super Administrator' || currentUser?.role === 'Registrar';

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Search and Action Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search input group */}
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by Name, Exam No, or Matric No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Filters and Buttons */}
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
                <UserPlus size={14} />
                <span>Register Student</span>
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

      {/* Main Students List Grid Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
                <th className="py-4 px-6">Student details</th>
                <th className="py-4 px-6">Exam Number</th>
                <th className="py-4 px-6">Programme / Dept</th>
                <th className="py-4 px-6">Origin Details</th>
                <th className="py-4 px-6">Grad Year</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">
                    No student records matching filters found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const dept = dbDepartments.find(d => d.id === std.departmentId);
                  const prog = dbProgrammes.find(p => p.id === std.programmeId);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/40">
                      <td className="py-3 px-6 flex items-center gap-3">
                        <img 
                          src={std.studentPhotograph} 
                          alt={std.fullName} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-100"
                        />
                        <div>
                          <span className="block font-extrabold text-slate-900 uppercase">{std.fullName}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Matric: {std.matricNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded select-all">{std.registrationNumber}</span>
                        <span className="block text-[10px] text-slate-400 mt-1">Adm: {std.admissionNumber}</span>
                      </td>
                      <td className="py-3 px-6">
                        <span className="block text-slate-800 uppercase">{prog ? prog.name : 'ICT'}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 block">{dept ? dept.code : 'CS'}</span>
                      </td>
                      <td className="py-3 px-6">
                        <span className="block font-bold">{std.state} State</span>
                        <span className="text-[10px] text-slate-400 block">{std.localGovernment} LGA</span>
                      </td>
                      <td className="py-3 px-6 font-mono font-bold text-slate-800">
                        {std.graduationYear}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex gap-2 justify-center">
                          {canModify ? (
                            <button
                              onClick={() => handleStartEdit(std)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="Edit Record"
                            >
                              <Edit2 size={14} />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold italic">Read Only</span>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete ${std.fullName}? This will also wipe out their exam score records!`)) {
                                  deleteStudentDB(std.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                              title="Delete Record"
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

      {/* 1. Add / Edit Student Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <UserPlus size={16} className="text-blue-600" />
                <span>{editingStudentId ? 'Edit Student Record' : 'Register New Student'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Exam Number *</label>
                  <input
                    type="text" required value={regNo} onChange={(e) => setRegNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 uppercase"
                    placeholder="e.g. DITEM/DICT/2026/0045"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Admission Number</label>
                  <input
                    type="text" value={admNo} onChange={(e) => setAdmNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 uppercase"
                    placeholder="e.g. ADM/2026/0122"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Matric Number</label>
                  <input
                    type="text" value={matNo} onChange={(e) => setMatNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 uppercase"
                    placeholder="e.g. MAT/DICT/2026/0010"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Gender</label>
                  <select
                    value={gender} onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">State of Origin</label>
                  <input
                    type="text" value={state} onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    placeholder="e.g. Kaduna"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Local Government</label>
                  <input
                    type="text" value={lga} onChange={(e) => setLga(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    placeholder="e.g. Kaduna North"
                  />
                </div>
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
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Session Term</label>
                  <select
                    value={sessId} onChange={(e) => setSessId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
                  >
                    {dbSessions.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Graduation Year</label>
                  <input
                    type="text" value={gradYear} onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Student Photograph (Base64 or URL)</label>
                <input
                  type="text" value={photograph} onChange={(e) => setPhotograph(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 text-slate-500"
                />
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
                  {editingStudentId ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. Bulk Copy-Paste CSV Import Modal Dialog */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <FileSpreadsheet size={16} className="text-emerald-600" />
                <span>Bulk Student CSV Import</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBulkCSVImport} className="p-6 space-y-4">
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-semibold">
                <span className="text-slate-700 uppercase font-bold block mb-1">Paste CSV Template format:</span>
                <span className="font-mono text-slate-600 block bg-slate-100 p-2 rounded border border-slate-200 overflow-x-auto select-all">
                  fullName,examNumber,admissionNumber,matricNumber,gender,state<br />
                  SULEIMAN BELLO,DITEM/DICT/2026/0091,ADM/2026/0191,MAT/DICT/2026/0091,Male,Kaduna<br />
                  MARYAM ISAH,DITEM/DICT/2026/0092,ADM/2026/0192,MAT/DICT/2026/0092,Female,Kano
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">CSV Text Content</label>
                <textarea
                  required value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={6}
                  placeholder="Paste your comma-separated rows here..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50/50"
                ></textarea>
              </div>

              {/* Feedback messages */}
              {importStatus && (
                <div className="space-y-2 text-xs font-bold">
                  {importStatus.success > 0 && (
                    <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>Successfully registered {importStatus.success} new student records!</span>
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
                        {importStatus.errors.length > 5 && <li>... and {importStatus.errors.length - 5} more errors.</li>}
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
