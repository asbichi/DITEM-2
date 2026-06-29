import React from 'react';
import { Application } from '../context/AppContext';

interface PrintableAdmissionFormProps {
  formData: Partial<Application>;
}

export default function PrintableAdmissionForm({ formData }: PrintableAdmissionFormProps) {
  return (
    <div className="bg-white p-8 border border-gray-200 print:border-none print:p-0">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center border-b-2 border-red-600 pb-6 mb-6">
        <img 
          src="https://i.ibb.co/TB4PbDRN/294463932-545722830683545-9019441332151319432-n.jpg" 
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
          Contact: 08069196891 | Email: jameeluks@gmail.com
        </p>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4">
          Official Admission Form
        </h2>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Photo Area */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-32 h-40 border-2 border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
            {formData.pictureUrl ? (
              <img src={formData.pictureUrl} alt="Student Passport" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm text-center">Passport<br/>Photograph</span>
            )}
          </div>
        </div>

        {/* Details Area */}
        <div className="flex-grow">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700 w-1/3">Surname:</th>
                <td className="py-3 text-gray-900 uppercase">{formData.surname}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">First Name:</th>
                <td className="py-3 text-gray-900 uppercase">{formData.firstName}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">Other Name:</th>
                <td className="py-3 text-gray-900 uppercase">{formData.otherName || '-'}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">Program Applied:</th>
                <td className="py-3 text-gray-900 font-medium">{formData.program}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">Duration:</th>
                <td className="py-3 text-gray-900">{formData.duration}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">Session Batch:</th>
                <td className="py-3 text-gray-900">{formData.sessionBatch}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">Contact Number:</th>
                <td className="py-3 text-gray-900">{formData.contactNumber}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">Payment Status:</th>
                <td className="py-3 text-red-600 font-bold uppercase">NOT PAID</td>
              </tr>
              <tr>
                <th className="py-3 font-semibold text-gray-700 align-top">Student Address:</th>
                <td className="py-3 text-gray-900">{formData.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Signatures */}
      <div className="mt-16 flex justify-between pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="w-48 border-b border-gray-400 mb-2"></div>
          <p className="text-sm text-gray-600">Student Signature & Date</p>
        </div>
        <div className="text-center">
          <div className="w-48 border-b border-gray-400 mb-2"></div>
          <p className="text-sm text-gray-600">Admin Signature & Stamp</p>
        </div>
      </div>
    </div>
  );
}
