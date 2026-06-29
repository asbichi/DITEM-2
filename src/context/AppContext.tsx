import React, { createContext, useContext, useState } from 'react';

export interface Course {
  id: string;
  name: string;
  image: string;
}

export interface Application {
  id: string;
  surname: string;
  firstName: string;
  otherName: string;
  program: string;
  duration: string;
  sessionBatch: string;
  pictureUrl: string;
  address: string;
  contactNumber: string;
  dateApplied: string;
  status: 'Pending' | 'Reviewed' | 'Accepted';
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  date: string;
  status: 'New' | 'Read';
}

export interface Student {
  id: string;
  name: string;
  course: string;
  duration: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  startDate: string;
  status: 'Active' | 'Completed' | 'Dropped';
}

interface AppContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  deleteCourse: (id: string) => void;
  applications: Application[];
  addApplication: (app: Omit<Application, 'id' | 'dateApplied' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  enquiries: Enquiry[];
  addEnquiry: (enq: Omit<Enquiry, 'id' | 'date' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'startDate' | 'status' | 'balance'>) => void;
  updateStudentStatus: (id: string, status: Student['status']) => void;
  deleteStudent: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Data Analysis', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '2', name: 'Cyber Security', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '3', name: 'Data Science', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '4', name: 'DevOps', image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '5', name: 'Graphics Design', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '6', name: 'CCNA', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '7', name: 'APP Design using Python', image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '8', name: 'Programming Languages', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '9', name: 'Microsoft Office Specialist', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '10', name: 'Web Design', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '11', name: 'Huawei Courses', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '12', name: 'Diploma in ICT', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '13', name: 'Certificate in ICT', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ]);

  const [applications, setApplications] = useState<Application[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Ahmad Musa', course: 'Data Analysis', duration: '3 Months', totalAmount: 50000, amountPaid: 30000, balance: 20000, startDate: '2026-01-15', status: 'Active' },
    { id: '2', name: 'Fatima Bello', course: 'Web Design', duration: '4 Months', totalAmount: 45000, amountPaid: 45000, balance: 0, startDate: '2026-02-10', status: 'Active' },
  ]);

  const addCourse = (course: Omit<Course, 'id'>) => {
    setCourses([...courses, { ...course, id: Date.now().toString() }]);
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const addApplication = (app: Omit<Application, 'id' | 'dateApplied' | 'status'>) => {
    const newApp: Application = {
      ...app,
      id: Date.now().toString(),
      dateApplied: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    setApplications([newApp, ...applications]);
    
    // Also add to students list immediately as requested
    addStudent({
      name: `${app.firstName} ${app.surname}`,
      course: app.program,
      duration: app.duration,
      totalAmount: 0, // Default to 0, admin can update later
      amountPaid: 0
    });
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
  };

  const addEnquiry = (enq: Omit<Enquiry, 'id' | 'date' | 'status'>) => {
    const newEnq: Enquiry = {
      ...enq,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      status: 'New'
    };
    setEnquiries([newEnq, ...enquiries]);
  };

  const updateEnquiryStatus = (id: string, status: Enquiry['status']) => {
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
  };

  const addStudent = (student: Omit<Student, 'id' | 'startDate' | 'status' | 'balance'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      balance: student.totalAmount - student.amountPaid
    };
    setStudents([newStudent, ...students]);
  };

  const updateStudentStatus = (id: string, status: Student['status']) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      courses, addCourse, deleteCourse, 
      applications, addApplication, updateApplicationStatus,
      enquiries, addEnquiry, updateEnquiryStatus,
      students, addStudent, updateStudentStatus, deleteStudent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
