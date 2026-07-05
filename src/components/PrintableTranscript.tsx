import React from 'react';
import VerificationQRCode from './VerificationQRCode';
import { logoBase64 } from './logoData';

export interface TranscriptCourse {
  id: string;
  code: string;
  title: string;
  creditUnits: string;
  marks?: string;
  grade: string;
  points: string;
  remarks: string;
}

export interface TranscriptData {
  studentName: string;
  registrationNumber: string;
  admissionNumber?: string;
  matricNumber?: string;
  studentPhotograph?: string;
  programme: string;
  department?: string;
  faculty?: string;
  duration: string;
  sessionBatch?: string;
  graduationYear?: string;
  dateOfIssue?: string;
  courses: TranscriptCourse[];
  gpa: string;
  cgpa?: string;
  totalCreditUnits?: string;
  creditsPassed?: string;
  creditsFailed?: string;
  customClassification?: string;
  customDate?: string;
  verificationCode?: string;
  transcriptNumber?: string;
}

interface PrintableTranscriptProps {
  data: TranscriptData;
}

export default function PrintableTranscript({ data }: PrintableTranscriptProps) {
  // Honors classification calculation
  const getClassification = (gpaStr: string) => {
    if (data.customClassification) return data.customClassification;
    const gpaVal = parseFloat(gpaStr) || 0;
    if (gpaVal >= 3.5) return 'DISTINCTION';
    if (gpaVal >= 3.0) return 'UPPER CREDIT';
    if (gpaVal >= 2.5) return 'LOWER CREDIT';
    if (gpaVal >= 2.0) return 'PASS';
    return 'FAILED';
  };

  const finalClassification = getClassification(data.gpa);
  const gradYear = data.graduationYear || '2026';
  const tNumber = data.transcriptNumber || 'TRANS/2026/000001';
  const vCode = data.verificationCode || 'DITEM-SEC-925A1B';

  return (
    <div className="relative bg-white p-8 md:p-12 w-full max-w-[1050px] mx-auto text-stone-900 font-sans print:p-4 overflow-hidden border border-stone-200 shadow-2xl rounded-sm">
      
      {/* Font styles */}
      <style>{`
        .font-transcript-heading {
          font-family: 'Plus Jakarta Sans', "Inter", ui-sans-serif, system-ui, sans-serif;
        }
        .font-mono-retro {
          font-family: 'JetBrains Mono', monospace;
        }
        
        /* Dashed Table Styling matching the authentic dot matrix layout */
        .retro-dashed-table {
          border-collapse: collapse;
          width: 100%;
        }
        .retro-dashed-table th, .retro-dashed-table td {
          border: 1px dashed #4a5568 !important;
          padding: 8px 12px;
          text-align: left;
        }
        .retro-dashed-table th {
          font-weight: bold;
          text-transform: uppercase;
          background-color: transparent;
        }
      `}</style>

      {/* Faint DITEM security background watermark */}
      <img 
        src={logoBase64} 
        alt="DITEM Watermark" 
        className="absolute inset-0 m-auto w-1/2 h-auto opacity-[0.025] select-none pointer-events-none object-contain"
        referrerPolicy="no-referrer"
      />

      {/* Logo in center top */}
      <div className="flex flex-col items-center justify-center mb-6 relative z-10">
        <img 
          src={logoBase64}
          alt="DITEM Logo"
          className="w-auto h-20 object-contain mb-2"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Transcript Header Text */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-normal text-red-700 leading-tight uppercase font-transcript-heading" style={{ fontWeight: 900, textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
          Dialogue Institute of Technology & Management
        </h1>
        <p className="text-[10px] md:text-xs font-bold tracking-widest text-stone-600 italic mt-2 uppercase">
          63 TAFAWA BALEWA WAY, KADUNA
        </p>
      </div>

      {/* Double-bordered Green Academic Transcript Heading box */}
      <div className="flex justify-center mb-10 relative z-10">
        <div className="p-0.5 border-2 border-green-700/80 rounded-sm">
          <div className="border border-green-700/60 px-8 py-2 bg-white">
            <span className="text-sm md:text-base font-extrabold uppercase tracking-[0.25em] text-green-800 font-transcript-heading">
              ACADEMIC TRANSCRIPT
            </span>
          </div>
        </div>
      </div>

      {/* Student Profile Block matching image layout exactly */}
      <div className="space-y-3.5 border-b border-stone-200 pb-8 mb-10 text-sm md:text-base relative z-10 font-medium">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 py-1">
          <span className="md:col-span-4 text-stone-500 font-bold uppercase tracking-wider text-xs md:text-sm flex items-center">
            STUDENT'S NAME:
          </span>
          <span className="md:col-span-8 font-extrabold text-stone-900 uppercase tracking-wide select-all text-sm md:text-base">
            {data.studentName}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 py-1">
          <span className="md:col-span-4 text-stone-500 font-bold uppercase tracking-wider text-xs md:text-sm flex items-center">
            REGISTRATION NUMBER:
          </span>
          <span className="md:col-span-8 font-mono-retro font-bold text-stone-950 select-all text-sm md:text-base">
            {data.registrationNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 py-1">
          <span className="md:col-span-4 text-stone-500 font-bold uppercase tracking-wider text-xs md:text-sm flex items-center">
            PROGRAMME:
          </span>
          <span className="md:col-span-8 font-extrabold text-stone-900 uppercase text-xs md:text-sm">
            {data.programme}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 py-1">
          <span className="md:col-span-4 text-stone-500 font-bold uppercase tracking-wider text-xs md:text-sm flex items-center">
            DURATION:
          </span>
          <span className="md:col-span-8 font-bold text-stone-800 uppercase text-xs md:text-sm">
            {data.duration || 'THREE (3) MONTHS'}
          </span>
        </div>
      </div>

      {/* Transcript Courses Grades Table & Grading scale Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10 mb-12">
        
        {/* Monospace Dashed Table column */}
        <div className="flex-grow w-full overflow-x-auto">
          <table className="retro-dashed-table font-mono-retro text-[11px] md:text-xs text-stone-900">
            <thead>
              <tr className="font-bold">
                <th>COURSE TITLE</th>
                <th className="w-28">COURSE CODE</th>
                <th className="w-28 text-center">CREDIT UNITS</th>
                <th className="w-16 text-center">GRADE</th>
                <th className="w-20 text-center">POINTS</th>
                <th className="w-24 text-center">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {data.courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 font-medium italic">
                    No academic exam scores registered on transcript database yet.
                  </td>
                </tr>
              ) : (
                data.courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.title}</td>
                    <td className="font-bold">{c.code}</td>
                    <td className="text-center">{c.creditUnits}</td>
                    <td className="text-center font-bold text-[13px]">{c.grade}</td>
                    <td className="text-center font-bold">{parseFloat(c.points).toFixed(2)}</td>
                    <td className="text-center font-bold">{c.remarks || 'PASSED'}</td>
                  </tr>
                ))
              )}
              {/* Monospace Grade Point row exactly as shown in the image */}
              <tr>
                <td colSpan={4} className="border-r-0"></td>
                <td className="text-center font-black text-sm bg-stone-50 border-l border-t-2" style={{ borderStyle: 'solid dashed' }}>
                  {parseFloat(data.gpa || '3.00').toFixed(2)}
                </td>
                <td className="border-l-0"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Classification sidebar column matching image */}
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col items-center lg:items-end space-y-6">
          
          {/* Classic Double-Bordered Green Classification Table with Shadow */}
          <div className="w-full bg-white p-[3px] border border-stone-300 rounded-sm shadow-md" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
            <div className="border-2 border-green-700/80 p-3.5 bg-green-50/20">
              <h4 className="font-bold text-center text-stone-800 text-xs tracking-wider uppercase mb-3 font-transcript-heading border-b border-green-700/30 pb-1.5">
                DIPLOMA CLASSIFICATION
              </h4>
              <div className="space-y-2 font-mono-retro text-[11px] text-stone-700 font-semibold">
                <div className="flex justify-between items-center">
                  <span>DISTINCTION</span>
                  <span className="font-bold text-stone-900">3.50 – 4.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>UPPER CREDIT</span>
                  <span className="font-bold text-stone-900">3.00 – 3.49</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>LOWER CREDIT</span>
                  <span className="font-bold text-stone-900">2.50 – 2.99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>PASS</span>
                  <span className="font-bold text-stone-900">2.00 – 2.49</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure cryptographic validation metadata */}
          <div className="w-full text-center border border-dashed border-stone-300 p-3 rounded bg-stone-50 text-[10px] font-mono-retro space-y-1 text-stone-500">
            <div>S/N: <strong className="text-stone-700">{tNumber}</strong></div>
            <div>VERIFICATION ID: <strong className="text-stone-700">{vCode}</strong></div>
            <div className="pt-2 flex justify-center scale-90">
              <VerificationQRCode 
                studentName={data.studentName}
                registrationNumber={data.registrationNumber}
                programme={data.programme}
                graduationYear={gradYear}
                classification={finalClassification}
                certificateNumber={tNumber}
                verificationCode={vCode}
                documentType="Transcript"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Footer Area - Signature Line, Seal Stamp & Secure Notice */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-stone-200 pt-8 mt-12 relative z-10 text-xs">
        
        {/* Registrar Line (Left) */}
        <div className="md:col-span-5 flex flex-col items-start">
          <div className="w-full max-w-[280px] h-[1px] bg-stone-400 mb-1.5"></div>
          <span className="font-bold uppercase text-[10px] text-stone-700 tracking-wider font-transcript-heading">
            Registrar's Signature & Date
          </span>
        </div>

        {/* Center Official stamp notice */}
        <div className="md:col-span-7 flex flex-col items-center md:items-end justify-center">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest font-mono-retro">
            VALID WITH OFFICIAL SIGNATURE AND SEAL
          </span>
        </div>
      </div>

    </div>
  );
}
