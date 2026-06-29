import React, { useState, useRef } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  Printer,
  Download,
  FileDown
} from 'lucide-react';
import { useAppContext, Application } from '../context/AppContext';
import PrintableAdmissionForm from '../components/PrintableAdmissionForm';
import PrintableStudentList from '../components/PrintableStudentList';
import PrintableTranscript, { TranscriptData, TranscriptCourse } from '../components/PrintableTranscript';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Admin Dashboard Components
const DashboardHome = () => {
  const { courses, applications, enquiries, students } = useAppContext();
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Students', value: students.length.toString(), color: 'bg-blue-500' },
          { title: 'Active Courses', value: courses.length.toString(), color: 'bg-purple-500' },
          { title: 'New Admissions', value: applications.length.toString(), color: 'bg-red-500' },
          { title: 'New Enquiries', value: enquiries.filter(e => e.status === 'New').length.toString(), color: 'bg-yellow-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{stat.title}</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Admissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">No applications yet</td>
                  </tr>
                ) : (
                  applications.slice(0, 5).map((app, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 text-gray-900 font-medium">{app.surname} {app.firstName}</td>
                      <td className="py-4 text-gray-600">{app.program}</td>
                      <td className="py-4 text-gray-500">{app.dateApplied}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Enquiries</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">No enquiries yet</td>
                  </tr>
                ) : (
                  enquiries.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 text-gray-900 font-medium">{row.name}</td>
                      <td className="py-4 text-gray-600">{row.course}</td>
                      <td className="py-4 text-gray-500">{row.date}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          row.status === 'New' ? 'bg-red-100 text-red-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsManager = () => {
  const { students, courses, addStudent, updateStudentStatus, deleteStudent } = useAppContext();
  const [newName, setNewName] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newTotal, setNewTotal] = useState('');
  const [newPaid, setNewPaid] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCourse || !newDuration) return;
    addStudent({ 
      name: newName, 
      course: newCourse, 
      duration: newDuration,
      totalAmount: Number(newTotal) || 0,
      amountPaid: Number(newPaid) || 0
    });
    setNewName('');
    setNewCourse('');
    setNewDuration('');
    setNewTotal('');
    setNewPaid('');
  };

  const handleGenerateReport = () => {
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button 
            onClick={() => setShowPreview(false)}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
          >
            <X size={20} />
            Back to Management
          </button>
          <div className="flex flex-col items-end">
            <button 
              type="button"
              onClick={() => {
                window.focus();
                setTimeout(() => window.print(), 100);
              }}
              className="flex items-center gap-2 bg-brand-accent text-white px-6 py-2 rounded-lg hover:bg-brand-accent-hover transition-colors shadow-md"
            >
              <Printer size={18} />
              Confirm & Print Record
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Note: If printing doesn't start, please open the app in a new tab.
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <PrintableStudentList students={students} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
        <button 
          onClick={handleGenerateReport}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
        >
          <FileText size={18} />
          Generate Student Records
        </button>
      </div>
      
      {/* Add Student Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 print:hidden">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Register New Student</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
              placeholder="Student Name" 
              required 
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select 
              value={newCourse} 
              onChange={e => setNewCourse(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white" 
              required 
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input 
              type="text" 
              value={newDuration} 
              onChange={e => setNewDuration(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
              placeholder="e.g. 3 Months" 
              required 
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total (₦)</label>
            <input 
              type="number" 
              value={newTotal} 
              onChange={e => setNewTotal(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
              placeholder="Total Fee" 
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid (₦)</label>
            <input 
              type="number" 
              value={newPaid} 
              onChange={e => setNewPaid(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
              placeholder="Amount Paid" 
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors h-[42px]">
            Add Student
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="py-4 px-6 font-medium">Student Name</th>
                <th className="py-4 px-6 font-medium">Course & Duration</th>
                <th className="py-4 px-6 font-medium">Financials (₦)</th>
                <th className="py-4 px-6 font-medium">Balance (₦)</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No students registered yet.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">Started: {student.startDate}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{student.course}</p>
                      <p className="text-xs text-brand-accent font-medium">{student.duration}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs">Total: {student.totalAmount.toLocaleString()}</span>
                        <span className="text-green-600 font-medium">Paid: {student.amountPaid.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${student.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {student.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Active' ? 'bg-green-100 text-green-800' :
                        student.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <select 
                          value={student.status}
                          onChange={(e) => updateStudentStatus(student.id, e.target.value as any)}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Dropped">Dropped</option>
                        </select>
                        <button 
                          onClick={() => deleteStudent(student.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
};

const AdmissionsManager = () => {
  const { applications, updateApplicationStatus } = useAppContext();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handlePrint = (app: Application) => {
    setSelectedApp(app);
    // Focus the window to ensure print command is received
    window.focus();
    // Wait for state to update and render
    setTimeout(() => {
      window.print();
      setSelectedApp(null);
    }, 100);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 print:hidden">Manage Admissions</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="py-4 px-6 font-medium">Applicant</th>
                <th className="py-4 px-6 font-medium">Program & Batch</th>
                <th className="py-4 px-6 font-medium">Contact</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No admission applications found.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {app.pictureUrl ? (
                            <img src={app.pictureUrl} alt="Applicant" className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-full h-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.surname} {app.firstName}</p>
                          <p className="text-xs text-gray-500">{app.otherName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900 font-medium">{app.program}</p>
                      <p className="text-xs text-brand-accent font-semibold">{app.duration}</p>
                      <p className="text-xs text-gray-500">{app.sessionBatch}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-600">{app.contactNumber}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]" title={app.address}>{app.address}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{app.dateApplied}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <select 
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Accepted">Accepted</option>
                        </select>
                        <button 
                          onClick={() => handlePrint(app)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                          title="Print Form"
                        >
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Printable Form Area */}
      {selectedApp && (
        <div className="hidden print:block">
          <PrintableAdmissionForm formData={selectedApp} />
        </div>
      )}
    </div>
  );
};

const CoursesManager = () => {
  const { courses, addCourse, deleteCourse } = useAppContext();
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newImage) return;
    addCourse({ name: newName, image: newImage });
    setNewName('');
    setNewImage('');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Courses</h2>
      
      {/* Add Course Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Course</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input 
              type="text" 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
              placeholder="e.g. Cloud Computing" 
              required 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input 
              type="url" 
              value={newImage} 
              onChange={e => setNewImage(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
              placeholder="https://..." 
              required 
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full md:w-auto">
            Add Course
          </button>
        </form>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Current Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="border border-gray-100 rounded-lg overflow-hidden flex flex-col group">
              <div className="h-40 w-full overflow-hidden">
                <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 flex justify-between items-center bg-gray-50 flex-1">
                <span className="font-semibold text-gray-800">{course.name}</span>
                <button 
                  onClick={() => deleteCourse(course.id)} 
                  className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                  title="Delete Course"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EnquiriesManager = () => {
  const { enquiries, updateEnquiryStatus } = useAppContext();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Enquiries</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Contact</th>
                <th className="py-4 px-6 font-medium">Course of Interest</th>
                <th className="py-4 px-6 font-medium">Message</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No enquiries found.</td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${enq.status === 'New' ? 'bg-red-50/30' : ''}`}>
                    <td className="py-4 px-6 font-medium text-gray-900">{enq.name}</td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900">{enq.phone}</p>
                      <p className="text-xs text-blue-600 hover:underline"><a href={`mailto:${enq.email}`}>{enq.email}</a></p>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{enq.course}</td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate" title={enq.message}>{enq.message}</td>
                    <td className="py-4 px-6 text-gray-500">{enq.date}</td>
                    <td className="py-4 px-6">
                      <select 
                        value={enq.status}
                        onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                        className={`text-sm border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${enq.status === 'New' ? 'border-red-300 text-red-700 bg-red-50' : 'border-gray-300'}`}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                      </select>
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
};

const parseCSVRow = (str: string) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' && str[i+1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const TranscriptsManager = () => {
  const [data, setData] = useState<TranscriptData>({
    studentName: '',
    registrationNumber: '',
    programme: 'DIPLOMA IN INFORMATION AND COMMUNICATION TECHNOLOGY',
    duration: 'THREE (3) MONTHS',
    courses: [
      { id: '1', code: 'ICT 101', title: 'HTML & CSS', creditUnits: '3', grade: 'A', points: '12.00', remarks: 'PASSED' },
    ],
    gpa: '0.00'
  });
  const [mode, setMode] = useState<'single_edit' | 'preview_single' | 'preview_bulk'>('single_edit');
  const [batchTranscripts, setBatchTranscripts] = useState<TranscriptData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const elements = document.querySelectorAll('.transcript-page');
      if (elements.length === 0) return;

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save(mode === 'preview_bulk' ? 'Bulk_Transcripts.pdf' : 'Transcript.pdf');
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF. You can try the Print button instead.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleUpdateContent = (field: keyof TranscriptData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateCourse = (id: string, field: keyof TranscriptCourse, value: string) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    }));
  };

  const addCourseRow = () => {
    const newCourse: TranscriptCourse = {
      id: Date.now().toString(),
      code: '',
      title: '',
      creditUnits: '3',
      grade: 'A',
      points: '12.00',
      remarks: 'PASSED'
    };
    setData((prev) => ({ ...prev, courses: [...prev.courses, newCourse] }));
  };

  const removeCourseRow = (id: string) => {
    setData((prev) => ({ ...prev, courses: prev.courses.filter((c) => c.id !== id) }));
  };

  const downloadCSVTemplate = () => {
    const headers = ['Student Name', 'Registration Number', 'Programme', 'Duration', 'GPA'];
    data.courses.forEach(c => {
      headers.push(`${c.code || 'Course'} Grade`);
      headers.push(`${c.code || 'Course'} Points`);
      headers.push(`${c.code || 'Course'} Remarks`);
    });

    const sampleRow = ['JOHN DOE', 'DITEM/001', data.programme, data.duration, '3.50'];
    data.courses.forEach(c => {
      sampleRow.push('A');
      sampleRow.push('12.00');
      sampleRow.push('PASSED');
    });

    const csvContent = headers.join(',') + '\n' + sampleRow.map(s => `"${s}"`).join(',');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Transcript_Bulk_Template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
      if (lines.length < 2) {
        alert('Invalid CSV: Need at least headers and one data row');
        return;
      }

      const newBatch: TranscriptData[] = [];
      const templateCourses = data.courses;

      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVRow(lines[i]);
        if (row.length < 5) continue;

        const studentName = row[0] || '';
        const registrationNumber = row[1] || '';
        const programme = row[2] || data.programme;
        const duration = row[3] || data.duration;
        const gpa = row[4] || '';

        const parsedCourses: TranscriptCourse[] = templateCourses.map((tc, idx) => {
          const baseOffset = 5 + (idx * 3);
          return {
            id: tc.id + '_' + i,
            code: tc.code,
            title: tc.title,
            creditUnits: tc.creditUnits,
            grade: row[baseOffset] || '',
            points: row[baseOffset + 1] || '',
            remarks: row[baseOffset + 2] || 'PASSED'
          };
        });

        newBatch.push({
          studentName,
          registrationNumber,
          programme,
          duration,
          gpa,
          courses: parsedCourses
        });
      }

      setBatchTranscripts(newBatch);
      setMode('preview_bulk');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  if (mode === 'preview_single' || mode === 'preview_bulk') {
    const printData = mode === 'preview_single' ? [data] : batchTranscripts;
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button 
            onClick={() => setMode('single_edit')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
          >
            <X size={20} />
            Back to Editor
          </button>
          <div className="flex flex-col items-end">
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className={`flex items-center gap-2 ${isGeneratingPDF ? 'bg-slate-400' : 'bg-slate-800 hover:bg-slate-700'} text-white px-6 py-2 rounded-lg transition-colors shadow-md`}
              >
                <FileDown size={18} />
                {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button 
                type="button"
                onClick={() => {
                  window.focus();
                  setTimeout(() => window.print(), 100);
                }}
                className="flex items-center gap-2 bg-brand-accent text-white px-6 py-2 rounded-lg hover:bg-brand-accent-hover transition-colors shadow-md"
              >
                <Printer size={18} />
                Confirm & Print {mode === 'preview_bulk' ? 'All Transcripts' : 'Transcript'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: If printing doesn't start, please open the app in a new tab.
            </p>
          </div>
        </div>
        
        <div className="space-y-12">
          {printData.map((transcript, idx) => (
            <div 
              key={idx} 
              className="transcript-page bg-white shadow-lg border border-gray-200 print:shadow-none print:border-none"
              style={{ pageBreakAfter: idx === printData.length - 1 ? 'auto' : 'always' }}
            >
              <PrintableTranscript data={transcript} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transcripts Management</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setMode('preview_single')}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
          >
            <FileText size={18} />
            Preview Single
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Single Student Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student's Name</label>
              <input value={data.studentName} onChange={(e) => handleUpdateContent('studentName', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input value={data.registrationNumber} onChange={(e) => handleUpdateContent('registrationNumber', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programme</label>
              <input value={data.programme} onChange={(e) => handleUpdateContent('programme', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input value={data.duration} onChange={(e) => handleUpdateContent('duration', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA / Total Points (Footer row under points)</label>
              <input value={data.gpa} onChange={(e) => handleUpdateContent('gpa', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none uppercase" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
          <h3 className="text-lg font-bold mb-4 text-blue-900">Bulk Generation</h3>
          <p className="text-sm text-blue-800 mb-4">
            Create your course template below, download the CSV template, fill it with your students' data, and upload it back here to generate multiple transcripts effortlessly.
          </p>
          <div className="space-y-4">
            <button 
              onClick={downloadCSVTemplate}
              className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 border border-blue-300 px-4 py-3 rounded-lg hover:bg-blue-100 font-medium transition-colors"
            >
              <Download size={18} />
              1. Download CSV Template
            </button>
            <div className="relative">
              <input 
                type="file" 
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden" 
                id="csv-upload"
              />
              <label 
                htmlFor="csv-upload"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors cursor-pointer"
              >
                <FileText size={18} />
                2. Upload Filled CSV & Preview
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Course Template</h3>
          <button onClick={addCourseRow} className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium">+ Add Row</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-sm font-medium text-gray-600">
                <th className="p-3 whitespace-nowrap">Course Code (e.g. ICT 101)</th>
                <th className="p-3 w-1/3">Course Title (e.g. HTML & CSS)</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Points</th>
                <th className="p-3">Remarks</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((course) => (
                <tr key={course.id} className="border-t border-gray-100">
                  <td className="p-2">
                    <input value={course.code} onChange={(e) => handleUpdateCourse(course.id, 'code', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:border-blue-500 outline-none uppercase text-sm" />
                  </td>
                  <td className="p-2">
                    <input value={course.title} onChange={(e) => handleUpdateCourse(course.id, 'title', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:border-blue-500 outline-none uppercase text-sm" />
                  </td>
                  <td className="p-2 w-20">
                    <input value={course.creditUnits} onChange={(e) => handleUpdateCourse(course.id, 'creditUnits', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:border-blue-500 outline-none uppercase text-center text-sm" />
                  </td>
                  <td className="p-2 w-20">
                    <input value={course.grade} onChange={(e) => handleUpdateCourse(course.id, 'grade', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:border-blue-500 outline-none uppercase text-center text-sm" />
                  </td>
                  <td className="p-2 w-24">
                    <input value={course.points} onChange={(e) => handleUpdateCourse(course.id, 'points', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:border-blue-500 outline-none uppercase text-center text-sm" />
                  </td>
                  <td className="p-2">
                    <input value={course.remarks} onChange={(e) => handleUpdateCourse(course.id, 'remarks', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:border-blue-500 outline-none uppercase text-sm" />
                  </td>
                  <td className="p-2">
                    <button onClick={() => removeCourseRow(course.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6 flex items-center justify-center h-full min-h-[60vh]">
    <div className="text-center text-gray-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title} Management</h2>
      <p>This module is under development.</p>
    </div>
  </div>
);

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/admin/students', icon: <Users size={20} /> },
    { name: 'Courses', path: '/admin/courses', icon: <BookOpen size={20} /> },
    { name: 'Admissions', path: '/admin/admissions', icon: <FileText size={20} /> },
    { name: 'Transcripts', path: '/admin/transcripts', icon: <FileText size={20} /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 print:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-20 px-6 bg-gray-950">
          <Link to="/" className="flex items-center gap-3">
            <img src="https://i.ibb.co/TB4PbDRN/294463932-545722830683545-9019441332151319432-n.jpg" alt="DITEM Logo" className="h-8 w-auto object-contain bg-white rounded p-0.5" />
            <span className="font-bold text-lg tracking-wider">DITEM ADMIN</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <div className="pt-8 mt-8 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-6 z-10 print:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
              {navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Abdullahi Bichi Shuaib</p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
              AB
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/students" element={<StudentsManager />} />
            <Route path="/courses" element={<CoursesManager />} />
            <Route path="/admissions" element={<AdmissionsManager />} />
            <Route path="/transcripts" element={<TranscriptsManager />} />
            <Route path="/enquiries" element={<EnquiriesManager />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
