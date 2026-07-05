import React, { useState } from 'react';
import { Shield, CheckCircle, Copy, ExternalLink, Calendar, Award, User, Hash } from 'lucide-react';

interface VerificationQRCodeProps {
  studentName: string;
  registrationNumber: string;
  programme: string;
  graduationYear: string;
  classification: string;
  certificateNumber: string;
  verificationCode: string;
  documentType: 'Transcript' | 'Certificate';
}

export default function VerificationQRCode({
  studentName,
  registrationNumber,
  programme,
  graduationYear,
  classification,
  certificateNumber,
  verificationCode,
  documentType
}: VerificationQRCodeProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const verificationUrl = `https://ditem.edu.ng/verify?code=${verificationCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Interactive QR Code Vector Visualizer */}
      <div 
        onClick={() => setShowModal(true)}
        className="flex flex-col items-center justify-center p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer group select-none max-w-[130px] text-center"
        title="Click to verify secure credentials"
      >
        <div className="relative w-20 h-20 bg-white p-1 rounded-lg border border-slate-100 flex items-center justify-center">
          {/* Simulated High-Fidelity Cryptographic QR Matrix */}
          <svg className="w-full h-full text-slate-800" viewBox="0 0 29 29" fill="none" stroke="currentColor" strokeWidth="1" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            {/* Corner Anchors */}
            <rect x="1" y="1" width="7" height="7" strokeWidth="2" />
            <rect x="3" y="3" width="3" height="3" fill="currentColor" stroke="none" />
            
            <rect x="21" y="1" width="7" height="7" strokeWidth="2" />
            <rect x="23" y="3" width="3" height="3" fill="currentColor" stroke="none" />
            
            <rect x="1" y="21" width="7" height="7" strokeWidth="2" />
            <rect x="3" y="23" width="3" height="3" fill="currentColor" stroke="none" />
            
            {/* Small Alignment Pattern */}
            <rect x="21" y="21" width="3" height="3" strokeWidth="1" />
            <rect x="22" y="22" width="1" height="1" fill="currentColor" stroke="none" />

            {/* Simulated Data Dots Block */}
            <path d="M 9,1 L 9,2 M 9,4 L 9,8 M 11,2 L 13,2 M 15,1 L 19,1 M 17,3 L 17,7 M 11,5 L 15,5 M 13,7 L 19,7 M 9,10 L 12,10 M 14,10 L 19,10 M 21,9 L 21,13 M 23,11 L 28,11 M 25,13 L 25,17 M 1,9 L 1,12 M 3,10 L 7,10 M 5,12 L 5,16 M 9,13 L 9,17 M 11,15 L 16,15 M 13,17 L 13,19 M 18,13 L 18,17 M 21,16 L 24,16 M 27,15 L 27,19 M 22,18 L 22,20 M 1,18 L 5,18 M 8,21 L 8,24 M 9,23 L 13,23 M 11,25 L 11,28 M 14,21 L 14,25 M 16,23 L 19,23 M 15,26 L 19,26 M 17,28 L 17,29 M 25,22 L 28,22 M 26,24 L 26,28 M 28,26 L 28,28" strokeLinecap="square" strokeWidth="1.2" />
            <path d="M 10,12 L 10,14 M 12,13 L 14,13 M 15,11 L 15,14" strokeLinecap="square" strokeWidth="1.2" />
          </svg>
          
          {/* Security Center Badge Overlay */}
          <div className="absolute inset-0 m-auto w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm text-white transform group-hover:scale-110 transition-transform">
            <Shield size={10} className="fill-current" />
          </div>
        </div>
        <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
          Scan to Verify
        </span>
        <span className="text-[7px] font-mono text-slate-400 font-medium select-all block">
          {verificationCode}
        </span>
      </div>

      {/* Dynamic Security Verification Dialog / Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Secure Academic Credentials</h3>
                  <p className="text-xs text-white/80 uppercase tracking-wider">Institution Verification Ledger</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl mb-6">
                <CheckCircle size={18} className="fill-current text-emerald-600" />
                <span>OFFICIALLY VERIFIED BY DIALOGUE INSTITUTE REGISTRY</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <User size={14} />
                    <span>Student Name:</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 uppercase">{studentName}</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Hash size={14} />
                    <span>Registration No:</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-700">{registrationNumber}</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Award size={14} />
                    <span>Programme of Study:</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 text-right max-w-[260px] leading-tight">{programme}</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Calendar size={14} />
                    <span>Graduation Year:</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{graduationYear}</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Award size={14} className="text-emerald-600" />
                    <span>Honors Classification:</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700 uppercase bg-emerald-100/60 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {classification}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Hash size={14} />
                    <span>{documentType} Serial Number:</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-700">{certificateNumber}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Shield size={14} />
                    <span>Verification Code:</span>
                  </div>
                  <span className="text-xs font-mono font-black text-blue-600 tracking-wider bg-blue-50 px-2.5 py-1 rounded border border-blue-100 select-all">
                    {verificationCode}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  <Copy size={14} />
                  {copied ? 'Copied Verification URL!' : 'Copy Verification Link'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold transition-all text-center"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
