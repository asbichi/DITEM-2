import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Printer, CheckCircle, Upload, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import PrintableAdmissionForm from '../components/PrintableAdmissionForm';

export default function Admission() {
  const { courses, addApplication } = useAppContext();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    otherName: '',
    program: '',
    duration: '',
    sessionBatch: '',
    address: '',
    contactNumber: '',
    pictureUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, pictureUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addApplication(formData);
    
    // Notify admin via email client safely without breaking the page flow
    const subject = encodeURIComponent(`New Admission Application: ${formData.firstName} ${formData.surname}`);
    const body = encodeURIComponent(`Hello Admin,\n\nA new admission application has been submitted.\n\nApplicant: ${formData.firstName} ${formData.surname}\nProgram: ${formData.program}\nSession: ${formData.sessionBatch}\nContact: ${formData.contactNumber}\n\nPlease log in to the Admin Dashboard to review the full application and passport photograph.\n\nBest regards,\nDITEM System`);
    
    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:jameeluks@gmail.com?subject=${subject}&body=${body}`;
    mailtoLink.target = '_blank';
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink);
    
    setSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintBlank = () => {
    // Temporarily clear form for printing blank
    const originalData = { ...formData };
    setFormData({
      surname: '____________________',
      firstName: '____________________',
      otherName: '____________________',
      program: '____________________',
      duration: '____________________',
      sessionBatch: '____________________',
      address: '________________________________________',
      contactNumber: '____________________',
      pictureUrl: ''
    });
    
    // Use timeout to allow state update to render
    setTimeout(() => {
      window.print();
      // Restore data after print dialog closes (or is cancelled)
      setFormData(originalData);
    }, 100);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto">
          {/* Action Buttons (Hidden on Print) */}
          <div className="flex justify-between items-center mb-6 print:hidden">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center text-green-600 font-medium"
            >
              <CheckCircle className="mr-2" />
              Application Submitted Successfully!
            </motion.div>
            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Printer className="mr-2 h-5 w-5" />
              Print Form
            </motion.button>
          </div>

          {/* Printable Form Area */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="print:shadow-none print:border-none"
          >
            <PrintableAdmissionForm formData={formData} />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mb-6 flex justify-end print:hidden">
        <button 
          onClick={handlePrintBlank}
          className="flex items-center gap-2 text-slate-600 hover:text-brand-accent font-bold transition-colors"
        >
          <FileText size={20} />
          Print Blank Form
        </button>
      </div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden print:hidden"
      >
        <div className="bg-brand-accent py-6 px-8 text-white text-center">
          <h2 className="text-2xl font-bold">Admission Application Form</h2>
          <p className="text-red-100 mt-2">Fill in your details to apply for a program</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileFocus={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surname *</label>
              <input required type="text" name="surname" value={formData.surname} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent transition-all" />
            </motion.div>
            <motion.div whileFocus={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent transition-all" />
            </motion.div>
            <motion.div whileFocus={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Name</label>
              <input type="text" name="otherName" value={formData.otherName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent transition-all" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileFocus={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Applied *</label>
              <select required name="program" value={formData.program} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent bg-white transition-all">
                <option value="">Select a Program</option>
                {courses.map(course => (
                  <option key={course.id} value={course.name}>{course.name}</option>
                ))}
              </select>
            </motion.div>
            <motion.div whileFocus={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
              <input required type="text" name="duration" placeholder="e.g. 3 Months" value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent transition-all" />
            </motion.div>
            <motion.div whileFocus={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Batch *</label>
              <input required type="text" name="sessionBatch" placeholder="e.g. 2026 Batch A" value={formData.sessionBatch} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent transition-all" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileFocus={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input required type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent transition-all" />
            </motion.div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passport Size Picture *</label>
              <div className="mt-1 flex items-center">
                <motion.label 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-all"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} required={!formData.pictureUrl} />
                </motion.label>
                {formData.pictureUrl && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 text-sm text-green-600 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Photo uploaded
                  </motion.span>
                )}
              </div>
            </div>
          </div>

          <motion.div whileFocus={{ scale: 1.01 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Address *</label>
            <textarea required name="address" rows={3} value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent transition-all"></textarea>
          </motion.div>

          <div className="pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-brand-accent text-white py-3 px-4 rounded-md hover:bg-brand-accent-hover transition-colors font-bold text-lg shadow-md"
            >
              Submit Application
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Hidden Printable Form for Blank Printing */}
      <div className="hidden print:block">
         <PrintableAdmissionForm formData={formData} />
      </div>
    </div>
  );
}
