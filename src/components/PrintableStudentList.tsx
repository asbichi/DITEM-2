import React from 'react';
import { logoBase64 } from './logoData';
import { Student } from '../context/AppContext';

interface PrintableStudentListProps {
  students: Student[];
}

export default function PrintableStudentList({ students }: PrintableStudentListProps) {
  // Group students by course
  const groupedStudents = students.reduce((acc, student) => {
    const course = student.course || 'Unassigned';
    if (!acc[course]) {
      acc[course] = [];
    }
    acc[course].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  const courses = Object.keys(groupedStudents).sort();

  const grandTotalRevenue = students.reduce((sum, s) => sum + s.totalAmount, 0);
  const grandTotalPaid = students.reduce((sum, s) => sum + s.amountPaid, 0);
  const grandTotalBalance = students.reduce((sum, s) => sum + s.balance, 0);

  return (
    <div className="bg-white p-8">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center border-b-2 border-red-600 pb-6 mb-6">
        <img 
          src={logoBase64} 
          alt="DITEM Logo" 
          className="h-24 w-auto mb-4"
          referrerPolicy="no-referrer"
        />
        <h1 className="text-3xl font-extrabold text-red-600 uppercase tracking-wider mb-2">
          Dialogue Institute of Technology & Management
        </h1>
        <p className="text-gray-600 font-medium">
          Dialogue Centre, 61 Tafawa Balewa Way close to KASU Kaduna
        </p>
        <p className="text-gray-600 font-medium">
          Official Student Records - {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4 text-center mb-8">
          Departmental Student Enrollment & Financial Report
        </h2>
        
        {courses.map((courseName) => {
          const courseStudents = groupedStudents[courseName];
          const courseTotalRevenue = courseStudents.reduce((sum, s) => sum + s.totalAmount, 0);
          const courseTotalPaid = courseStudents.reduce((sum, s) => sum + s.amountPaid, 0);
          const courseTotalBalance = courseStudents.reduce((sum, s) => sum + s.balance, 0);

          return (
            <div key={courseName} className="mb-10 break-inside-avoid">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3 uppercase">
                Department: {courseName}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-xs uppercase font-bold">
                      <th className="border border-gray-300 p-2 w-12">S/N</th>
                      <th className="border border-gray-300 p-2">Student Name</th>
                      <th className="border border-gray-300 p-2">Duration</th>
                      <th className="border border-gray-300 p-2">Total (₦)</th>
                      <th className="border border-gray-300 p-2">Paid (₦)</th>
                      <th className="border border-gray-300 p-2">Balance (₦)</th>
                      <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {courseStudents.map((student, index) => (
                      <tr key={student.id}>
                        <td className="border border-gray-300 p-2">{index + 1}</td>
                        <td className="border border-gray-300 p-2 font-medium">{student.name}</td>
                        <td className="border border-gray-300 p-2">{student.duration}</td>
                        <td className="border border-gray-300 p-2">{student.totalAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 p-2">{student.amountPaid.toLocaleString()}</td>
                        <td className="border border-gray-300 p-2 font-bold">{student.balance.toLocaleString()}</td>
                        <td className="border border-gray-300 p-2">{student.status}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold text-sm">
                      <td colSpan={3} className="border border-gray-300 p-2 text-right uppercase">Dept. Totals:</td>
                      <td className="border border-gray-300 p-2">₦{courseTotalRevenue.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2">₦{courseTotalPaid.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2">₦{courseTotalBalance.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}

        {/* Grand Summary Section */}
        <div className="mt-12 border-2 border-gray-800 p-6 break-inside-avoid bg-gray-50">
          <h3 className="text-center font-bold text-lg uppercase mb-4 underline">Grand Summary (All Departments)</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 border border-gray-300 bg-white">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Expected Revenue</p>
              <p className="text-xl font-extrabold text-gray-900">₦{grandTotalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 border border-gray-300 bg-white">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Amount Collected</p>
              <p className="text-xl font-extrabold text-green-700">₦{grandTotalPaid.toLocaleString()}</p>
            </div>
            <div className="p-3 border border-gray-300 bg-white">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Outstanding Balance</p>
              <p className="text-xl font-extrabold text-red-700">₦{grandTotalBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Signatures */}
      <div className="mt-16 flex justify-between pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="w-48 border-b border-gray-400 mb-2"></div>
          <p className="text-sm text-gray-600">Registrar Signature</p>
        </div>
        <div className="text-center">
          <div className="w-48 border-b border-gray-400 mb-2"></div>
          <p className="text-sm text-gray-600">Director Signature & Stamp</p>
        </div>
      </div>
    </div>
  );
}
