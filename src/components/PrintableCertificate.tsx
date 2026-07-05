import React, { useState } from 'react';
import { TranscriptData } from './PrintableTranscript';
import { Palette, Shield, Award, Sparkles } from 'lucide-react';
import VerificationQRCode from './VerificationQRCode';
import { logoBase64 } from './logoData';

interface PrintableCertificateProps {
  data: TranscriptData;
}

// Custom SVG Flame Logo matching the DITEM branding
export const DitemLogo = ({ className = "h-16" }: { className?: string }) => (
  <div className={`flex flex-col items-center justify-center ${className} select-none`}>
    <img 
      src={logoBase64}
      alt="DITEM Logo"
      className="w-auto h-16 object-contain"
      referrerPolicy="no-referrer"
    />
  </div>
);

export default function PrintableCertificate({ data }: PrintableCertificateProps) {
  // Available design themes
  const [stylePreset, setStylePreset] = useState<'official' | 'ivory' | 'classic'>('official');

  // Automatically calculate classification
  const getClassification = (gpaStr: string) => {
    const gpaVal = parseFloat(gpaStr) || 0;
    if (gpaVal >= 3.5) return 'DISTINCTION';
    if (gpaVal >= 3.0) return 'UPPER CREDIT';
    if (gpaVal >= 2.5) return 'LOWER CREDIT';
    if (gpaVal >= 2.0) return 'PASS';
    return 'FAILED';
  };

  const classification = getClassification(data.gpa);

  // Date formatting
  const displayDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const gradYear = data.graduationYear || '2026';
  const cNumber = data.transcriptNumber ? data.transcriptNumber.replace('TRANS/', 'CERT/') : 'CERT/2026/000001';
  const vCode = data.verificationCode || 'DITEM-SEC-925A1B';

  return (
    <div className="relative w-full max-w-[1050px] mx-auto">
      
      {/* On-Screen Interactive Theme Selector (Hidden in print mode) */}
      <div className="print:hidden mb-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-rose-600" />
          <span className="text-xs font-bold text-slate-700 font-sans">Certificate Background Tone:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'official', label: 'DITEM Authentic (Textured Gold)', dots: ['bg-[#fdf9ee]', 'bg-[#c2272d]'] },
            { id: 'ivory', label: 'Polished Ivory Cream', dots: ['bg-[#faf6eb]', 'bg-[#eab308]'] },
            { id: 'classic', label: 'Minimalist Off-White', dots: ['bg-[#fafafa]', 'bg-stone-800'] }
          ].map((theme) => {
            const isSelected = stylePreset === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setStylePreset(theme.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all shadow-sm ${isSelected ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                <div className="flex gap-0.5 mr-0.5">
                  <span className={`w-2 h-2 rounded-full ${theme.dots[0]}`}></span>
                  <span className={`w-2 h-2 rounded-full ${theme.dots[1]}`}></span>
                </div>
                {theme.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Certificate matching uploaded specimen */}
      <div 
        className={`relative p-12 md:p-16 overflow-hidden shadow-2xl rounded-sm transition-all duration-300 border border-stone-200 ${
          stylePreset === 'official' 
            ? 'bg-[#FCF8EE]' 
            : stylePreset === 'ivory' 
            ? 'bg-[#F9F5EA]' 
            : 'bg-[#FCFCFC]'
        }`}
        style={{
          backgroundImage: stylePreset !== 'classic' 
            ? 'radial-gradient(circle, #fdfbf7 0%, #f6efe0 100%)' 
            : 'none',
          minHeight: '760px'
        }}
      >
        
        {/* Font families */}
        <style>{`
          .font-display-title {
            font-family: 'Cinzel', serif;
          }
          .font-body-serif {
            font-family: 'Playfair Display', Georgia, serif;
          }
          .font-cursive-signature {
            font-family: 'Alex Brush', cursive;
          }
          .font-cursive-italic {
            font-family: 'Great Vibes', cursive;
          }
          
          /* Watermark background texture */
          .bg-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60%;
            height: auto;
            opacity: 0.045;
            pointer-events: none;
            mix-blend-mode: multiply;
          }
        `}</style>

        {/* Faint DITEM security background watermark */}
        <img 
          src={logoBase64} 
          alt="DITEM Watermark" 
          className="bg-watermark"
          referrerPolicy="no-referrer"
        />

        {/* Outer border lines */}
        <div className="absolute inset-4 border border-amber-900/10 pointer-events-none rounded-sm"></div>
        <div className="absolute inset-5 border border-amber-900/5 pointer-events-none rounded-sm"></div>

        {/* Inner Content Area */}
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[640px]">
          
          {/* Header & Logo */}
          <div className="text-center flex flex-col items-center">
            <DitemLogo className="mb-4" />
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl whitespace-nowrap font-black tracking-wide text-red-700 font-display-title uppercase leading-tight" style={{ fontWeight: 900, textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
              Dialogue Institute of Technology & Management
            </h1>
            <p className="text-sm md:text-base font-bold tracking-widest text-stone-800 font-display-title mt-1">
              KADUNA
            </p>
            
            <p className="text-base md:text-lg italic text-stone-600 font-body-serif mt-6">
              This is to certify that:
            </p>
          </div>

          {/* Student Name placed OVER horizontal line */}
          <div className="text-center my-8 relative max-w-[750px] mx-auto w-full">
            <p className="text-3xl md:text-4xl font-bold font-body-serif text-stone-900 tracking-wide pb-2 relative z-10">
              {data.studentName || 'Student Name'}
            </p>
            <div className="w-full h-[1.5px] bg-stone-400 absolute bottom-0 left-0"></div>
          </div>

          {/* Narrative Text */}
          <div className="text-center max-w-[780px] mx-auto my-4 px-4">
            <p className="text-sm md:text-base text-stone-700 font-body-serif leading-relaxed italic">
              having successfully completed an approved course of study,
            </p>
            <p className="text-sm md:text-base text-stone-700 font-body-serif leading-relaxed italic mt-1">
              passed the prescribed examinations, and fulfilled all other conditions,
            </p>
            <p className="text-sm md:text-base text-stone-700 font-body-serif leading-relaxed italic mt-1">
              has this day, under the authority of the Academic Board, been awarded the:
            </p>
          </div>

          {/* Awarded Program placed OVER horizontal line */}
          <div className="text-center my-8 relative max-w-[850px] mx-auto w-full">
            <p className="text-xl md:text-2xl font-extrabold text-[#b32424] uppercase tracking-wider pb-2 font-display-title relative z-10">
              {data.programme || 'DIPLOMA IN INFORMATION AND COMMUNICATION TECHNOLOGY'}
            </p>
            <div className="w-full h-[1.5px] bg-stone-400 absolute bottom-0 left-0"></div>
          </div>

          {/* Classification of Honors */}
          <div className="text-center flex flex-col items-center gap-1 my-4">
            <p className="text-sm italic text-stone-500 font-body-serif">with</p>
            <div className="relative min-w-[320px] text-center mt-2">
              <p className="text-2xl font-bold text-stone-900 tracking-widest uppercase font-display-title pb-1 relative z-10">
                {classification}
              </p>
              <div className="w-full h-[1px] bg-stone-400 absolute bottom-0 left-0"></div>
            </div>
          </div>

          {/* Bottom Area: Rector, Seal + Date, Registrar, QR Stamp */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mt-12 pt-6 text-center text-xs relative">
            
            {/* Rector Signature Slot (Left) */}
            <div className="flex flex-col items-center justify-end h-28">
              {/* Cursive style signature */}
              <div className="font-cursive-signature text-2xl text-stone-700 h-8 -mb-1">
                Engr. Dr. Abdullahi B. S.
              </div>
              <div className="w-full max-w-[180px] h-[1px] bg-stone-400 mb-1"></div>
              <span className="font-bold uppercase tracking-wider text-stone-600 text-[10px] font-display-title">
                Rector
              </span>
            </div>

            {/* Red Wax Seal Sticker & Date (Center) */}
            <div className="flex flex-col items-center relative justify-end h-32">
              {/* The bright red starburst seal exactly as shown in the image */}
              <div className="absolute -top-12 flex items-center justify-center">
                <div className="relative w-24 h-24 flex items-center justify-center filter drop-shadow-md">
                  {/* Outer scalloped/starburst rosette */}
                  <div 
                    className="absolute w-24 h-24 bg-[#d11a1a]" 
                    style={{ 
                      clipPath: 'polygon(50% 0%, 54% 3%, 58% 1%, 62% 5%, 66% 2%, 70% 7%, 74% 4%, 78% 10%, 82% 8%, 85% 14%, 88% 13%, 91% 19%, 93% 19%, 95% 25%, 97% 26%, 98% 32%, 99% 34%, 99% 41%, 100% 43%, 99% 50%, 99% 52%, 98% 59%, 97% 61%, 95% 67%, 93% 68%, 91% 74%, 88% 75%, 85% 81%, 82% 82%, 78% 87%, 74% 88%, 70% 93%, 66% 93%, 62% 98%, 58% 97%, 54% 100%, 50% 98%, 46% 100%, 42% 97%, 38% 98%, 34% 93%, 30% 93%, 26% 88%, 22% 87%, 18% 82%, 15% 81%, 12% 75%, 9% 74%, 7% 68%, 5% 67%, 3% 61%, 2% 59%, 1% 52%, 1% 50%, 0% 43%, 1% 41%, 1% 34%, 2% 32%, 3% 26%, 5% 25%, 7% 19%, 9% 19%, 12% 13%, 15% 14%, 18% 8%, 22% 10%, 26% 4%, 30% 7%, 34% 2%, 38% 5%, 42% 1%, 46% 3%)' 
                    }}
                  ></div>
                  {/* Inner gold dashed ring */}
                  <div className="absolute w-[84px] h-[84px] border-2 border-dashed border-[#eab308]/60 rounded-full flex items-center justify-center">
                    <div className="w-[72px] h-[72px] bg-[#b31414] rounded-full border border-[#eab308]/40 flex flex-col items-center justify-center text-[8px] text-[#eab308] font-bold font-display-title tracking-widest text-center leading-none p-1 shadow-inner">
                      <span>OFFICIAL</span>
                      <span className="text-[6px] text-white mt-1">SEAL OF</span>
                      <span className="text-[9px] text-white font-black tracking-widest mt-0.5">DITEM</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Date Block */}
              <div className="text-stone-700 text-[11px] font-bold tracking-wider font-display-title mt-4">
                Date: <span className="border-b border-stone-400 px-3 pb-0.5 text-stone-900 font-sans">{displayDate}</span>
              </div>
            </div>

            {/* Registrar & Stamp Slot (Right) */}
            <div className="flex flex-col items-center justify-end h-28 relative">
              {/* Traditional DITEM Stamp Watermark behind Registrar Signature */}
              <div className="absolute top-1 right-2 border-[1.5px] border-[#9333ea]/35 text-[#9333ea]/35 px-2.5 py-1 font-black text-[10px] font-mono transform rotate-12 tracking-widest rounded-sm select-none pointer-events-none uppercase">
                Dialogue Stamp
              </div>
              {/* Cursive style signature */}
              <div className="font-cursive-signature text-2xl text-stone-700 h-8 -mb-1">
                Mal. Bello Y. Abubakar
              </div>
              <div className="w-full max-w-[180px] h-[1px] bg-stone-400 mb-1"></div>
              <span className="font-bold uppercase tracking-wider text-stone-600 text-[10px] font-display-title">
                Registrar
              </span>
            </div>

          </div>

          {/* Secure Digital Verification Hologram & Identifiers (Sits elegantly at the very bottom) */}
          <div className="mt-12 pt-4 border-t border-dashed border-stone-300 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 font-mono">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span>Certificate No: <strong className="text-stone-700">{cNumber}</strong></span>
              <span>Security Code: <strong className="text-stone-700">{vCode}</strong></span>
            </div>
            
            <div className="text-center italic font-sans text-[10px] text-stone-400 max-w-[320px]">
              Valid with official registrar stamp and secure digital cryptographic check.
            </div>

            {/* Micro Secure QR badge */}
            <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded border border-stone-200 shadow-sm print:shadow-none">
              <div className="scale-75 origin-right">
                <VerificationQRCode 
                  studentName={data.studentName}
                  registrationNumber={data.registrationNumber}
                  programme={data.programme}
                  graduationYear={gradYear}
                  classification={classification}
                  certificateNumber={cNumber}
                  verificationCode={vCode}
                  documentType="Certificate"
                />
              </div>
              <div className="flex flex-col text-left leading-normal text-[8px] max-w-[100px] text-stone-500 font-sans">
                <span className="font-bold text-stone-700">Scan to Verify</span>
                <span>Secure Digital Credential</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
