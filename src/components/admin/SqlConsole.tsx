import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Terminal, Database, Upload, Download, CheckCircle2, AlertCircle, Play } from 'lucide-react';

export default function SqlConsole() {
  const context = useAppContext();
  const [sqlQuery, setSqlQuery] = useState('SELECT fullName, registrationNumber, state FROM students WHERE gender = \'Male\';');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Backup Trigger
  const handleBackup = () => {
    const payload = context.backupDatabase();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(payload);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ditem_database_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSuccessMsg('Full PostgreSQL relational database state exported to JSON backup file!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Handle Restore file upload
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result as string;
      const ok = context.restoreDatabase(contents);
      if (ok) {
        setSuccessMsg('Relational state successfully loaded. Cache and live views fully synchronized!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert('Failed to restore backup file. Format is corrupt or incompatible.');
      }
    };
    reader.readAsText(file);
  };

  // Simulated SQL Compiler and Executor engine
  const executeSQL = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryResult(null);
    setQueryError(null);

    const query = sqlQuery.trim().toLowerCase().replace(/;$/, '');
    if (!query) return;

    // Check query structure
    if (!query.startsWith('select')) {
      setQueryError('SQL EXECUTION WARNING: Only read-only "SELECT" statements are authorized via this development console interface to prevent schema mutation.');
      return;
    }

    // Extract table name from: SELECT col1, col2 FROM tableName [WHERE col = val]
    const selectPattern = /select\s+(.+?)\s+from\s+([a-z0-9_]+)(?:\s+where\s+(.+))?/i;
    const match = sqlQuery.match(selectPattern);

    if (!match) {
      setQueryError('SYNTAX ERROR: Failed to parse SQL statement. Ensure format matches: SELECT column1, column2 FROM tableName WHERE condition = \'value\';');
      return;
    }

    const columnsStr = match[1].trim();
    const tableName = match[2].trim().toLowerCase();
    const whereCondition = match[3] ? match[3].trim() : null;

    // Resolve table source in Context state
    let rawData: any[] = [];
    if (tableName === 'students') rawData = context.dbStudents;
    else if (tableName === 'courses') rawData = context.dbCourses;
    else if (tableName === 'examination_scores' || tableName === 'scores') rawData = context.dbExaminationScores;
    else if (tableName === 'audit_logs' || tableName === 'logs') rawData = context.dbAuditLogs;
    else if (tableName === 'users') rawData = context.dbUsers;
    else if (tableName === 'certificates') rawData = context.dbCertificates;
    else if (tableName === 'transcripts') rawData = context.dbTranscripts;
    else if (tableName === 'departments') rawData = context.dbDepartments;
    else if (tableName === 'programmes') rawData = context.dbProgrammes;
    else {
      setQueryError(`RELATIONAL DATABASE ERROR: Table "public.${tableName}" does not exist in schema blueprint. Available: students, courses, scores, logs, users, certificates, transcripts, departments, programmes.`);
      return;
    }

    // Apply basic WHERE condition filtering (supports equals, e.g., gender = 'Male')
    let filteredData = [...rawData];
    if (whereCondition) {
      const conditionPattern = /([a-z0-9_]+)\s*=\s*'([^']+)'/i;
      const condMatch = whereCondition.match(conditionPattern);
      if (condMatch) {
        const fieldName = condMatch[1].trim();
        const fieldValue = condMatch[2].trim();
        filteredData = filteredData.filter(item => {
          // find field in case insensitive manner
          const key = Object.keys(item).find(k => k.toLowerCase() === fieldName.toLowerCase());
          if (!key) return false;
          return String(item[key]).toUpperCase() === fieldValue.toUpperCase();
        });
      } else {
        // Fallback or warning
        setQueryError('WHERE CLAUSE CLAUSE ERROR: Basic SQL engine currently supports single string equality filters only (e.g. state = \'Kaduna\' or gender = \'Male\').');
        return;
      }
    }

    // Project columns select projection
    const projectedRows = filteredData.map(row => {
      if (columnsStr === '*') return row;
      const selectedCols = columnsStr.split(',').map(s => s.trim());
      const projected: any = {};
      selectedCols.forEach(col => {
        const realKey = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
        if (realKey) {
          projected[realKey] = row[realKey];
        } else {
          projected[col] = 'NULL';
        }
      });
      return projected;
    });

    setQueryResult(projectedRows);
    context.logActivity(context.currentUser?.id || 'system', 'SQL Query executed', `SuperAdmin executed SELECT projection on table ${tableName}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Database Operations Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-5">
          <Database size={16} className="text-blue-600" />
          <span>Relational Database Management Ledger</span>
        </h3>

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs font-bold rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Backup */}
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="block font-black text-slate-800 text-sm">Full State JSON Backup</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Compile and download the entire local PostgreSQL database state (Users, Students, Courses, Transcripts, Certificates, and Audit Logs) into a secure JSON backup file.
              </p>
            </div>
            <button
              onClick={handleBackup}
              className="mt-6 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Download size={14} />
              <span>Download DB Backup File</span>
            </button>
          </div>

          {/* Restore */}
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="block font-black text-slate-800 text-sm">Load / Restore Database</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Upload or drop a previously compiled Dialogue Institute JSON database backup file to override local cache states and restore records instantly.
              </p>
            </div>
            <div className="mt-6">
              <label className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-colors text-center w-full">
                <Upload size={14} />
                <span>Upload JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Interactive PostgreSQL Terminal */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-4">
          <Terminal size={16} className="text-blue-600" />
          <span>Interactive PostgreSQL Select Console Terminal</span>
        </h3>

        <form onSubmit={executeSQL} className="space-y-4">
          <div className="relative font-mono">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 text-green-400 p-4 rounded-xl text-xs font-semibold focus:outline-none border-2 border-slate-800 focus:border-blue-500 leading-relaxed font-mono resize-y"
            ></textarea>
            <button
              type="submit"
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"
            >
              <Play size={10} className="fill-current" />
              <span>Run Statement</span>
            </button>
          </div>
        </form>

        {/* Console Query Errors */}
        {queryError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-bold flex items-start gap-2 leading-relaxed">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{queryError}</span>
          </div>
        )}

        {/* Console Query Tabular output projection */}
        {queryResult && (
          <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden font-mono text-[11px] font-semibold text-slate-700 animate-fadeIn">
            <div className="bg-slate-100 px-4 py-2 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200 flex justify-between">
              <span>SQL Query Result Console Grid Output</span>
              <span>{queryResult.length} Rows returned</span>
            </div>
            
            <div className="overflow-x-auto">
              {queryResult.length === 0 ? (
                <p className="p-6 text-center text-slate-400 font-sans italic font-semibold">
                  Statement executed successfully. Returned 0 matches matching the condition.
                </p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      {Object.keys(queryResult[0]).map((key, idx) => (
                        <th key={idx} className="py-2.5 px-4 font-bold">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queryResult.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/60 font-medium text-slate-800">
                        {Object.values(row).map((val: any, colIdx) => (
                          <td key={colIdx} className="py-2.5 px-4 truncate max-w-xs" title={String(val)}>
                            {typeof val === 'object' ? JSON.stringify(val).substring(0, 30) + '...' : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
