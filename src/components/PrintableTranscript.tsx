import React from 'react';

export interface TranscriptCourse {
  id: string;
  code: string; // The image labels this "COURSE TITLE"
  title: string; // The image labels this "COURSE CODE"
  creditUnits: string;
  grade: string;
  points: string;
  remarks: string;
}

export interface TranscriptData {
  studentName: string;
  registrationNumber: string;
  programme: string;
  duration: string;
  courses: TranscriptCourse[];
  gpa: string; // The 3.17 figure
}

interface PrintableTranscriptProps {
  data: TranscriptData;
}

export default function PrintableTranscript({ data }: PrintableTranscriptProps) {
  return (
    <div className="bg-white p-8 w-full max-w-[1000px] mx-auto text-black font-sans print:p-0">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <img 
          src="https://i.ibb.co/TB4PbDRN/294463932-545722830683545-9019441332151319432-n.jpg" 
          alt="DITEM Logo" 
          className="h-32 w-auto mb-2 object-contain"
          referrerPolicy="no-referrer"
        />
        <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
          Dialogue Institute of Technology & Management
        </h1>
        <p className="text-md font-bold uppercase tracking-wider mb-6">
          61 Tafawa Balewa Way, Kaduna
        </p>
        
        <div className="border-4 border-double border-green-700 px-6 py-2">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-black">
            Academic Transcript
          </h2>
        </div>
      </div>

      {/* Student Details */}
      <div className="mb-8 space-y-4 font-bold text-lg">
        <div className="grid grid-cols-[250px_1fr] items-start">
          <span className="uppercase">Student's Name:</span>
          <span className="uppercase font-normal">{data.studentName}</span>
        </div>
        <div className="grid grid-cols-[250px_1fr] items-start">
          <span className="uppercase">Registration Number:</span>
          <span className="uppercase font-normal">{data.registrationNumber}</span>
        </div>
        <div className="grid grid-cols-[250px_1fr] items-start">
          <span className="uppercase">Programme:</span>
          <span className="uppercase font-normal">{data.programme}</span>
        </div>
        <div className="grid grid-cols-[250px_1fr] items-start">
          <span className="uppercase">Duration:</span>
          <span className="uppercase font-normal">{data.duration}</span>
        </div>
      </div>

      {/* Main Content Area (Table + Box) */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Table Area */}
        <div className="flex-grow w-full">
          <table className="w-full border-collapse border border-black text-sm text-center">
            <thead>
              <tr className="font-bold border-b border-black">
                <th className="border-r border-black p-1">COURSE TITLE</th>
                <th className="border-r border-black p-1 text-left">COURSE CODE</th>
                <th className="border-r border-black p-1">CREDIT UNITS</th>
                <th className="border-r border-black p-1">GRADE</th>
                <th className="border-r border-black p-1">POINTS</th>
                <th className="p-1">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((course, idx) => (
                <tr key={course.id} className="border-b border-black font-semibold">
                  <td className="border-r border-black p-1 uppercase">{course.code}</td>
                  <td className="border-r border-black p-1 text-left uppercase">{course.title}</td>
                  <td className="border-r border-black p-1 uppercase">{course.creditUnits}</td>
                  <td className="border-r border-black p-1 uppercase">{course.grade}</td>
                  <td className="border-r border-black p-1 uppercase">{course.points}</td>
                  <td className="p-1 uppercase">{course.remarks}</td>
                </tr>
              ))}
              {/* GPA Row */}
              <tr>
                <td colSpan={4} className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 font-bold">{data.gpa}</td>
                <td className="p-1"></td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-12">
            <h3 className="font-bold italic text-lg border-b border-black inline-block pr-6 mb-2">
              Registrar's Signature & Date
            </h3>
          </div>
        </div>

        {/* Classification Box */}
        <div className="flex-shrink-0 w-80 p-2 border-[12px] border-gray-300 shadow-md bg-green-50 shadow-[6px_6px_0px_#9ca3af]">
          <div className="border border-green-700 bg-green-100 p-4 font-bold text-sm">
            <h4 className="text-center text-lg uppercase mb-4 underline decoration-2 underline-offset-4">
              Diploma Classification
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>DISTINCTION</span>
                <span>3.50 – 4.00</span>
              </div>
              <div className="flex justify-between">
                <span>UPPER CREDIT</span>
                <span>3.00 – 3.49</span>
              </div>
              <div className="flex justify-between">
                <span>LOWER CREDIT</span>
                <span>2.50 – 2.99</span>
              </div>
              <div className="flex justify-between">
                <span>PASS</span>
                <span>2.00 – 2.49</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-300 font-bold uppercase tracking-wider text-sm underline decoration-gray-300 underline-offset-2">
          Valid with official signature and seal
        </p>
      </div>

    </div>
  );
}
