import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ShieldCheck, Search, Filter } from 'lucide-react';

export default function AuditLedger() {
  const { dbAuditLogs } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Filtering audit log entries
  const filteredLogs = dbAuditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || log.userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn">
      
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Cryptographic Security Audit Ledger</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time, read-only audit logging of administrative changes, user sessions, and database states.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs by action, details, or operator email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50"
        >
          <option value="">All Operator Roles</option>
          <option value="Super Administrator">Super Administrator</option>
          <option value="Examination Officer">Examination Officer</option>
          <option value="Registrar">Registrar</option>
          <option value="Data Entry Officer">Data Entry Officer</option>
        </select>
      </div>

      {/* Audit ledger rows table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-slate-600">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Role Badge</th>
                <th className="py-3 px-4">Action Item</th>
                <th className="py-3 px-4">Technical Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-bold italic font-sans text-xs">
                    No security transactions logged in this session range.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/40">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700 font-sans">
                      {log.userEmail}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        log.userRole === 'Super Administrator' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        log.userRole === 'Examination Officer' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        log.userRole === 'Registrar' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900 font-sans uppercase tracking-tight">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-sans text-[11px] font-semibold max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
