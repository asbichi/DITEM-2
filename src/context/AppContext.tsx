import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Relational Database Types ---

export interface DBUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Administrator' | 'Examination Officer' | 'Registrar' | 'Data Entry Officer' | 'Student';
  passwordHash: string; // Stored as simple string for local demo
  mfaEnabled: boolean;
}

export interface DBDepartment {
  id: string;
  name: string;
  code: string;
}

export interface DBProgramme {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  duration: string; // e.g. "2 Years" or "3 Months"
}

export interface DBSession {
  id: string;
  name: string; // e.g. "2025/2026"
}

export interface DBSemester {
  id: string;
  name: string; // e.g. "First Semester", "Second Semester"
}

export interface DBStudent {
  id: string;
  registrationNumber: string;
  admissionNumber: string;
  matricNumber: string;
  studentPhotograph: string; // Base64 or Unsplash url
  fullName: string;
  dateOfBirth: string;
  gender: string;
  state: string;
  localGovernment: string;
  departmentId: string;
  programmeId: string;
  sessionId: string;
  graduationYear: string;
  classOverride?: string; // Optional manual class override
}

export interface DBCourse {
  id: string;
  courseCode: string;
  courseTitle: string;
  creditUnit: number;
  semester: 'First' | 'Second';
  level: string; // "100", "200", "ND1", etc.
  departmentId: string;
  programmeId: string;
}

export interface DBExaminationScore {
  id: string;
  studentId: string;
  courseId: string;
  sessionId?: string;
  semester?: 'First' | 'Second';
  score: number;       // Combined score
  totalScore: number;  // Combined (max 100)
  grade: string;       // Calculated e.g. "A"
  gradePoint: number;  // e.g. 4.00
  qualityPoints: number; // gradePoint * creditUnit
  creditEarned: number;// Credit units if passed, 0 if failed
  remark: 'PASSED' | 'FAILED';
  status: 'Pending' | 'Approved' | 'Locked';
}

export interface DBTranscript {
  id: string;
  transcriptNumber: string; // e.g. TRANS/2026/000001
  studentId: string;
  dateOfIssue: string;
  issuedBy: string;
}

export interface DBCertificate {
  id: string;
  certificateNumber: string; // e.g. CERT/2026/000001
  studentId: string;
  verificationCode: string;  // Unique security verification hash
  dateOfIssue: string;
  issuedBy: string;
  status: 'Issued' | 'Pending' | 'Revoked';
}

export interface DBAuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface GradingRule {
  grade: string;
  minScore: number;
  maxScore: number;
  point: number;
  remark: string;
}

// --- Legacy Context Compatibility Types ---
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
  // Relational Database Tables
  dbUsers: DBUser[];
  dbDepartments: DBDepartment[];
  dbProgrammes: DBProgramme[];
  dbSessions: DBSession[];
  dbSemesters: DBSemester[];
  dbStudents: DBStudent[];
  dbCourses: DBCourse[];
  dbExaminationScores: DBExaminationScore[];
  dbTranscripts: DBTranscript[];
  dbCertificates: DBCertificate[];
  dbAuditLogs: DBAuditLog[];
  gradingRules: GradingRule[];
  
  // Active Auth Session State
  currentUser: DBUser | null;
  loginUser: (email: string, role: string) => boolean;
  logoutUser: () => void;
  enable2FA: (userId: string, enable: boolean) => void;

  // DB Table Mutation Handlers
  addStudentDB: (student: Omit<DBStudent, 'id'>) => DBStudent;
  updateStudentDB: (id: string, student: Partial<DBStudent>) => void;
  deleteStudentDB: (id: string) => void;
  
  addCourseDB: (course: Omit<DBCourse, 'id'>) => DBCourse;
  updateCourseDB: (id: string, course: Partial<DBCourse>) => void;
  deleteCourseDB: (id: string) => void;
  
  addExamScoreDB: (score: Omit<DBExaminationScore, 'id' | 'totalScore' | 'grade' | 'gradePoint' | 'qualityPoints' | 'creditEarned' | 'remark' | 'status'>) => DBExaminationScore;
  addExamScoresBulkDB: (scores: Omit<DBExaminationScore, 'id' | 'totalScore' | 'grade' | 'gradePoint' | 'qualityPoints' | 'creditEarned' | 'remark' | 'status'>[]) => { successCount: number; errors: string[] };
  deleteExamScoreDB: (id: string) => void;

  addTranscriptDB: (studentId: string, issuedBy: string) => DBTranscript;
  autoPopulateDemoScores: (studentId: string) => void;
  addCertificateDB: (studentId: string, issuedBy: string) => DBCertificate;
  updateCertificateStatusDB: (id: string, status: DBCertificate['status']) => void;
  
  addDepartmentDB: (dept: Omit<DBDepartment, 'id'>) => void;
  addProgrammeDB: (prog: Omit<DBProgramme, 'id'>) => void;
  addSessionDB: (sess: Omit<DBSession, 'id'>) => void;

  updateGradingRules: (rules: GradingRule[]) => void;
  logActivity: (userId: string, action: string, details: string) => void;

  // Database Backup and Restore
  backupDatabase: () => string; // Returns stringified JSON
  restoreDatabase: (jsonStr: string) => boolean;

  // Automatic computation helpers
  getStudentCalculatedGPA: (studentId: string) => {
    gpa: number;
    cgpa: number;
    totalCredits: number;
    creditsPassed: number;
    creditsFailed: number;
    classification: string;
  };

  // Legacy compatibility fields & operations (to prevent breaking any of the static website pages)
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
  // --- Initialize States with Local Storage or defaults ---

  const [dbUsers, setDbUsers] = useState<DBUser[]>(() => {
    const saved = localStorage.getItem('ditem_users');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'u1', name: 'Super Administrator', email: 'abdullahibichishuaib.abs@gmail.com', role: 'Super Administrator', passwordHash: 'bichi12', mfaEnabled: false },
      { id: 'u2', name: 'Dr. Ahmad Ibrahim', email: 'examofficer@ditem.edu', role: 'Examination Officer', passwordHash: 'exam123', mfaEnabled: false },
      { id: 'u3', name: 'Mal. Bello Yusuf', email: 'registrar@ditem.edu', role: 'Registrar', passwordHash: 'reg123', mfaEnabled: false },
      { id: 'u4', name: 'Zainab Abubakar', email: 'dataentry@ditem.edu', role: 'Data Entry Officer', passwordHash: 'data123', mfaEnabled: false },
      { id: 'u5', name: 'Ahmad Musa', email: 'student@ditem.edu', role: 'Student', passwordHash: 'student123', mfaEnabled: false },
    ];
  });

  const [dbDepartments, setDbDepartments] = useState<DBDepartment[]>(() => {
    const saved = localStorage.getItem('ditem_departments');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'd1', name: 'Computer Science & Information Technology', code: 'CSIT' },
      { id: 'd2', name: 'Business & Management Studies', code: 'BMS' },
      { id: 'd3', name: 'Engineering Technology', code: 'ET' },
    ];
  });

  const [dbProgrammes, setDbProgrammes] = useState<DBProgramme[]>(() => {
    const saved = localStorage.getItem('ditem_programmes');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'p1', name: 'Diploma in Information and Communication Technology', code: 'DICT', departmentId: 'd1', duration: '3 Months' },
      { id: 'p2', name: 'Higher National Diploma in Software Engineering', code: 'SE', departmentId: 'd1', duration: '2 Years' },
      { id: 'p3', name: 'National Diploma in Business Administration', code: 'NDBA', departmentId: 'd2', duration: '2 Years' },
    ];
  });

  const [dbSessions, setDbSessions] = useState<DBSession[]>(() => {
    const saved = localStorage.getItem('ditem_sessions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 's1', name: '2024/2025' },
      { id: 's2', name: '2025/2026' },
    ];
  });

  const [dbSemesters, setDbSemesters] = useState<DBSemester[]>(() => {
    const saved = localStorage.getItem('ditem_semesters');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'sem1', name: 'First Semester' },
      { id: 'sem2', name: 'Second Semester' },
    ];
  });

  const [dbStudents, setDbStudents] = useState<DBStudent[]>(() => {
    const saved = localStorage.getItem('ditem_db_students');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'st1',
        registrationNumber: 'DITEM/DICT/2026/0045',
        admissionNumber: 'ADM/2026/0122',
        matricNumber: 'MAT/DICT/2026/0010',
        studentPhotograph: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        fullName: 'ABDULLAHI SHUAIBU',
        dateOfBirth: '1999-05-12',
        gender: 'Male',
        state: 'Kaduna',
        localGovernment: 'Kaduna North',
        departmentId: 'd1',
        programmeId: 'p1',
        sessionId: 's2',
        graduationYear: '2026',
      },
      {
        id: 'st2',
        registrationNumber: 'DITEM/DICT/2026/0012',
        admissionNumber: 'ADM/2026/0088',
        matricNumber: 'MAT/DICT/2026/0024',
        studentPhotograph: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        fullName: 'AHMAD MUSA',
        dateOfBirth: '2001-08-20',
        gender: 'Male',
        state: 'Kano',
        localGovernment: 'Nassarawa',
        departmentId: 'd1',
        programmeId: 'p1',
        sessionId: 's2',
        graduationYear: '2026',
      }
    ];
  });

  const [dbCourses, setDbCourses] = useState<DBCourse[]>(() => {
    const saved = localStorage.getItem('ditem_db_courses');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'c1', courseCode: 'DICT 101', courseTitle: 'Introduction to Computer Systems', creditUnit: 3, semester: 'First', level: 'ND1', departmentId: 'd1', programmeId: 'p1' },
      { id: 'c2', courseCode: 'DICT 102', courseTitle: 'Web Technologies (HTML/CSS/JS)', creditUnit: 4, semester: 'First', level: 'ND1', departmentId: 'd1', programmeId: 'p1' },
      { id: 'c3', courseCode: 'DICT 103', courseTitle: 'Programming in Python', creditUnit: 3, semester: 'Second', level: 'ND1', departmentId: 'd1', programmeId: 'p1' },
      { id: 'c4', courseCode: 'DICT 104', courseTitle: 'Database Management Systems', creditUnit: 3, semester: 'Second', level: 'ND1', departmentId: 'd1', programmeId: 'p1' },
      { id: 'c5', courseCode: 'DICT 201', courseTitle: 'Software Engineering Principles', creditUnit: 3, semester: 'First', level: 'ND2', departmentId: 'd1', programmeId: 'p1' },
      { id: 'c6', courseCode: 'DICT 202', courseTitle: 'Data Structures & Algorithms', creditUnit: 4, semester: 'First', level: 'ND2', departmentId: 'd1', programmeId: 'p1' },
      { id: 'c7', courseCode: 'DICT 203', courseTitle: 'Cyber Security & Ethical Hacking', creditUnit: 3, semester: 'Second', level: 'ND2', departmentId: 'd1', programmeId: 'p1' },
      { id: 'c8', courseCode: 'DICT 204', courseTitle: 'Project Development & Seminar', creditUnit: 4, semester: 'Second', level: 'ND2', departmentId: 'd1', programmeId: 'p1' },
    ];
  });

  const [gradingRules, setGradingRules] = useState<GradingRule[]>(() => {
    const saved = localStorage.getItem('ditem_grading_rules');
    if (saved) return JSON.parse(saved);
    return [
      { grade: 'A', minScore: 70, maxScore: 100, point: 4.0, remark: 'Distinction' },
      { grade: 'B', minScore: 60, maxScore: 69, point: 3.0, remark: 'Upper Credit' },
      { grade: 'C', minScore: 50, maxScore: 59, point: 2.0, remark: 'Lower Credit' },
      { grade: 'D', minScore: 45, maxScore: 49, point: 1.0, remark: 'Pass' },
      { grade: 'F', minScore: 0, maxScore: 44, point: 0.0, remark: 'Failed' },
    ];
  });

  const [dbExaminationScores, setDbExaminationScores] = useState<DBExaminationScore[]>(() => {
    const saved = localStorage.getItem('ditem_examination_scores');
    if (saved) return JSON.parse(saved);
    // Pre-populate Abdullahi Shuaibu scores (st1) to demonstrate instant GPA calculations
    return [
      // Abdullahi Shuaibu (st1) - straight A's
      { id: 'e1', studentId: 'st1', courseId: 'c1', score: 85, totalScore: 85, grade: 'A', gradePoint: 4.0, qualityPoints: 12, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e2', studentId: 'st1', courseId: 'c2', score: 83, totalScore: 83, grade: 'A', gradePoint: 4.0, qualityPoints: 16, creditEarned: 4, remark: 'PASSED', status: 'Approved' },
      { id: 'e3', studentId: 'st1', courseId: 'c3', score: 76, totalScore: 76, grade: 'A', gradePoint: 4.0, qualityPoints: 12, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e4', studentId: 'st1', courseId: 'c4', score: 84, totalScore: 84, grade: 'A', gradePoint: 4.0, qualityPoints: 12, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e5', studentId: 'st1', courseId: 'c5', score: 82, totalScore: 82, grade: 'A', gradePoint: 4.0, qualityPoints: 12, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e6', studentId: 'st1', courseId: 'c6', score: 72, totalScore: 72, grade: 'A', gradePoint: 4.0, qualityPoints: 16, creditEarned: 4, remark: 'PASSED', status: 'Approved' },
      { id: 'e7', studentId: 'st1', courseId: 'c7', score: 78, totalScore: 78, grade: 'A', gradePoint: 4.0, qualityPoints: 12, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e8', studentId: 'st1', courseId: 'c8', score: 87, totalScore: 87, grade: 'A', gradePoint: 4.0, qualityPoints: 16, creditEarned: 4, remark: 'PASSED', status: 'Approved' },

      // Ahmad Musa (st2) - mixed grades (Lower Credit)
      { id: 'e9', studentId: 'st2', courseId: 'c1', score: 68, totalScore: 68, grade: 'B', gradePoint: 3.0, qualityPoints: 9.0, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e10', studentId: 'st2', courseId: 'c2', score: 62, totalScore: 62, grade: 'B', gradePoint: 3.0, qualityPoints: 12.0, creditEarned: 4, remark: 'PASSED', status: 'Approved' },
      { id: 'e11', studentId: 'st2', courseId: 'c3', score: 71, totalScore: 71, grade: 'A', gradePoint: 4.0, qualityPoints: 12.0, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e12', studentId: 'st2', courseId: 'c4', score: 56, totalScore: 56, grade: 'C', gradePoint: 2.0, qualityPoints: 6.0, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e13', studentId: 'st2', courseId: 'c5', score: 60, totalScore: 60, grade: 'B', gradePoint: 3.0, qualityPoints: 9.0, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e14', studentId: 'st2', courseId: 'c6', score: 65, totalScore: 65, grade: 'B', gradePoint: 3.0, qualityPoints: 12.0, creditEarned: 4, remark: 'PASSED', status: 'Approved' },
      { id: 'e15', studentId: 'st2', courseId: 'c7', score: 58, totalScore: 58, grade: 'C', gradePoint: 2.0, qualityPoints: 6.0, creditEarned: 3, remark: 'PASSED', status: 'Approved' },
      { id: 'e16', studentId: 'st2', courseId: 'c8', score: 64, totalScore: 64, grade: 'B', gradePoint: 3.0, qualityPoints: 12.0, creditEarned: 4, remark: 'PASSED', status: 'Approved' },
    ];
  });

  const [dbTranscripts, setDbTranscripts] = useState<DBTranscript[]>(() => {
    const saved = localStorage.getItem('ditem_transcripts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'tr1', transcriptNumber: 'TRANS/2026/000001', studentId: 'st1', dateOfIssue: '2026-07-03', issuedBy: 'Super Administrator' },
      { id: 'tr2', transcriptNumber: 'TRANS/2026/000002', studentId: 'st2', dateOfIssue: '2026-07-03', issuedBy: 'Super Administrator' },
    ];
  });

  const [dbCertificates, setDbCertificates] = useState<DBCertificate[]>(() => {
    const saved = localStorage.getItem('ditem_certificates');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'cer1', certificateNumber: 'CERT/2026/000001', studentId: 'st1', verificationCode: 'DITEM-SEC-925A1B', dateOfIssue: '2026-07-03', issuedBy: 'Super Administrator', status: 'Issued' },
      { id: 'cer2', certificateNumber: 'CERT/2026/000002', studentId: 'st2', verificationCode: 'DITEM-SEC-128E4C', dateOfIssue: '2026-07-03', issuedBy: 'Super Administrator', status: 'Issued' },
    ];
  });

  const [dbAuditLogs, setDbAuditLogs] = useState<DBAuditLog[]>(() => {
    const saved = localStorage.getItem('ditem_audit_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'l1', userId: 'u1', userEmail: 'abdullahibichishuaib.abs@gmail.com', userRole: 'Super Administrator', action: 'System Setup', details: 'Database initialized with demo schemas and 2 default students.', timestamp: '2026-07-03T08:00:00Z' }
    ];
  });

  const [currentUser, setCurrentUser] = useState<DBUser | null>(() => {
    const saved = localStorage.getItem('ditem_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep LocalStorage synced with state changes
  useEffect(() => {
    localStorage.setItem('ditem_users', JSON.stringify(dbUsers));
  }, [dbUsers]);
  useEffect(() => {
    localStorage.setItem('ditem_departments', JSON.stringify(dbDepartments));
  }, [dbDepartments]);
  useEffect(() => {
    localStorage.setItem('ditem_programmes', JSON.stringify(dbProgrammes));
  }, [dbProgrammes]);
  useEffect(() => {
    localStorage.setItem('ditem_sessions', JSON.stringify(dbSessions));
  }, [dbSessions]);
  useEffect(() => {
    localStorage.setItem('ditem_semesters', JSON.stringify(dbSemesters));
  }, [dbSemesters]);
  useEffect(() => {
    localStorage.setItem('ditem_db_students', JSON.stringify(dbStudents));
  }, [dbStudents]);
  useEffect(() => {
    localStorage.setItem('ditem_db_courses', JSON.stringify(dbCourses));
  }, [dbCourses]);
  useEffect(() => {
    localStorage.setItem('ditem_grading_rules', JSON.stringify(gradingRules));
  }, [gradingRules]);
  useEffect(() => {
    localStorage.setItem('ditem_examination_scores', JSON.stringify(dbExaminationScores));
  }, [dbExaminationScores]);
  useEffect(() => {
    localStorage.setItem('ditem_transcripts', JSON.stringify(dbTranscripts));
  }, [dbTranscripts]);
  useEffect(() => {
    localStorage.setItem('ditem_certificates', JSON.stringify(dbCertificates));
  }, [dbCertificates]);
  useEffect(() => {
    localStorage.setItem('ditem_audit_logs', JSON.stringify(dbAuditLogs));
  }, [dbAuditLogs]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ditem_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ditem_current_user');
    }
  }, [currentUser]);

  // --- Automatic Performance & Honors Computation Engine ---

  const getStudentCalculatedGPA = (studentId: string) => {
    // Get all registered courses for the student's programme
    const student = dbStudents.find(s => s.id === studentId);
    if (!student) return { gpa: 0, cgpa: 0, totalCredits: 0, creditsPassed: 0, creditsFailed: 0, classification: 'Failed' };

    const studentScores = dbExaminationScores.filter(e => e.studentId === studentId);
    
    let totalCredits = 0;
    let accumulatedPoints = 0;
    let creditsPassed = 0;
    let creditsFailed = 0;

    studentScores.forEach(score => {
      // Find the course to determine credit units
      const course = dbCourses.find(c => c.id === score.courseId);
      if (course) {
        const cred = course.creditUnit;
        totalCredits += cred;
        accumulatedPoints += (score.gradePoint * cred);
        if (score.grade !== 'F') {
          creditsPassed += cred;
        } else {
          creditsFailed += cred;
        }
      }
    });

    const gpaVal = totalCredits > 0 ? Number((accumulatedPoints / totalCredits).toFixed(2)) : 0.00;
    
    // Classify honors directly based on GPA
    let classification = 'Failed';
    if (gpaVal >= 3.50) {
      classification = 'DISTINCTION';
    } else if (gpaVal >= 3.00) {
      classification = 'UPPER CREDIT';
    } else if (gpaVal >= 2.50) {
      classification = 'LOWER CREDIT';
    } else if (gpaVal >= 2.00) {
      classification = 'PASS';
    } else {
      classification = 'FAILED';
    }

    return {
      gpa: gpaVal,
      cgpa: gpaVal, // In single batch context GPA equals CGPA
      totalCredits,
      creditsPassed,
      creditsFailed,
      classification
    };
  };

  // --- Auth Handlers ---

  const loginUser = (email: string, role: string): boolean => {
    // Find matching user (and auto-provision or login securely)
    const user = dbUsers.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.role === role);
    if (user) {
      setCurrentUser(user);
      logActivity(user.id, 'User Login', `Logged into the portal as ${role}`);
      return true;
    }
    // Auto-create standard demonstration roles if needed
    const existingEmailUser = dbUsers.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (existingEmailUser) {
      // If user exists but role was mismatched, let them in or update role
      const updatedUser = { ...existingEmailUser, role: role as any };
      setDbUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      logActivity(updatedUser.id, 'User Login', `Logged in as updated role: ${role}`);
      return true;
    }
    
    // Fallback: provision and log in
    const newUser: DBUser = {
      id: 'u_' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email,
      role: role as any,
      passwordHash: 'bichi12',
      mfaEnabled: false
    };
    setDbUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    logActivity(newUser.id, 'Account Provisioned', `New user automatically created and logged in with role: ${role}`);
    return true;
  };

  const logoutUser = () => {
    if (currentUser) {
      logActivity(currentUser.id, 'User Logout', 'Logged out of session');
    }
    setCurrentUser(null);
  };

  const enable2FA = (userId: string, enable: boolean) => {
    setDbUsers(prev => prev.map(u => u.id === userId ? { ...u, mfaEnabled: enable } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, mfaEnabled: enable } : null);
    }
    logActivity(userId, 'Security Mfa Toggle', `MFA has been ${enable ? 'ENABLED' : 'DISABLED'} successfully.`);
  };

  // --- Database Table Mutation Handlers ---

  const addStudentDB = (student: Omit<DBStudent, 'id'>): DBStudent => {
    const newStudent: DBStudent = {
      ...student,
      id: 'st_' + Date.now()
    };
    setDbStudents(prev => [newStudent, ...prev]);
    logActivity(currentUser?.id || 'system', 'Student Registered', `Registered student ${student.fullName} with Reg No: ${student.registrationNumber}`);
    return newStudent;
  };

  const updateStudentDB = (id: string, updatedFields: Partial<DBStudent>) => {
    setDbStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    const std = dbStudents.find(s => s.id === id);
    logActivity(currentUser?.id || 'system', 'Student Record Updated', `Modified fields for student ${std?.fullName || id}`);
  };

  const deleteStudentDB = (id: string) => {
    const std = dbStudents.find(s => s.id === id);
    setDbStudents(prev => prev.filter(s => s.id !== id));
    // Cascade delete exam scores for data integrity
    setDbExaminationScores(prev => prev.filter(score => score.studentId !== id));
    logActivity(currentUser?.id || 'system', 'Student Record Deleted', `Removed student ${std?.fullName || id} and all associated exam scores.`);
  };

  const addCourseDB = (course: Omit<DBCourse, 'id'>): DBCourse => {
    const newCourse: DBCourse = {
      ...course,
      id: 'c_' + Date.now()
    };
    setDbCourses(prev => [...prev, newCourse]);
    logActivity(currentUser?.id || 'system', 'Course Added', `Added course ${course.courseCode}: ${course.courseTitle}`);
    return newCourse;
  };

  const updateCourseDB = (id: string, updatedFields: Partial<DBCourse>) => {
    setDbCourses(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    const crs = dbCourses.find(c => c.id === id);
    logActivity(currentUser?.id || 'system', 'Course Updated', `Updated fields for course ${crs?.courseCode || id}`);
  };

  const deleteCourseDB = (id: string) => {
    const crs = dbCourses.find(c => c.id === id);
    setDbCourses(prev => prev.filter(c => c.id !== id));
    // Cascade delete exam scores for this course
    setDbExaminationScores(prev => prev.filter(score => score.courseId !== id));
    logActivity(currentUser?.id || 'system', 'Course Deleted', `Removed course ${crs?.courseCode || id} and all dependent scores.`);
  };

  // Score computation sub-engine using customizable rules
  const computeScoreMetrics = (score: number, courseId: string) => {
    const course = dbCourses.find(c => c.id === courseId);
    const creditUnits = course ? course.creditUnit : 3;

    // Map total to the current customizable grading scales
    let matchedRule = gradingRules.find(r => score >= r.minScore && score <= r.maxScore);
    if (!matchedRule) {
      // Fallback
      matchedRule = { grade: 'F', minScore: 0, maxScore: 44, point: 0, remark: 'Failed' };
    }

    const pointsEarned = matchedRule.point;
    const isPassed = matchedRule.grade !== 'F';
    const creditsPassed = isPassed ? creditUnits : 0;
    const qualityPoints = pointsEarned * creditUnits;

    return {
      total: score,
      grade: matchedRule.grade,
      gradePoint: pointsEarned,
      qualityPoints,
      creditEarned: creditsPassed,
      remark: (isPassed ? 'PASSED' : 'FAILED') as 'PASSED' | 'FAILED'
    };
  };

  const addExamScoreDB = (scoreIn: Omit<DBExaminationScore, 'id' | 'totalScore' | 'grade' | 'gradePoint' | 'qualityPoints' | 'creditEarned' | 'remark' | 'status'> & { status?: DBExaminationScore['status'] }): DBExaminationScore => {
    const metrics = computeScoreMetrics(scoreIn.score, scoreIn.courseId);
    
    // Check if score already exists for student + course to prevent duplicate entry
    const existingIndex = dbExaminationScores.findIndex(e => e.studentId === scoreIn.studentId && e.courseId === scoreIn.courseId);
    
    const newScore: DBExaminationScore = {
      ...scoreIn,
      id: existingIndex >= 0 ? dbExaminationScores[existingIndex].id : 'e_' + Date.now(),
      totalScore: metrics.total,
      grade: metrics.grade,
      gradePoint: metrics.gradePoint,
      qualityPoints: metrics.qualityPoints,
      creditEarned: metrics.creditEarned,
      remark: metrics.remark,
      status: scoreIn.status || 'Pending'
    };

    if (existingIndex >= 0) {
      setDbExaminationScores(prev => prev.map((item, idx) => idx === existingIndex ? newScore : item));
    } else {
      setDbExaminationScores(prev => [newScore, ...prev]);
    }

    const student = dbStudents.find(s => s.id === scoreIn.studentId);
    const course = dbCourses.find(c => c.id === scoreIn.courseId);
    logActivity(currentUser?.id || 'system', 'Exam Score Entered', `Score for ${student?.fullName || scoreIn.studentId} in course ${course?.courseCode || scoreIn.courseId} recorded as: ${metrics.total} (${metrics.grade})`);
    
    return newScore;
  };

  const addExamScoresBulkDB = (scoresIn: Omit<DBExaminationScore, 'id' | 'totalScore' | 'grade' | 'gradePoint' | 'qualityPoints' | 'creditEarned' | 'remark' | 'status'>[]) => {
    const errors: string[] = [];
    let successCount = 0;
    const computedScores: DBExaminationScore[] = [];

    scoresIn.forEach((scoreIn, idx) => {
      // Validate Reg Number and Course code exist!
      const student = dbStudents.find(s => s.id === scoreIn.studentId);
      const course = dbCourses.find(c => c.id === scoreIn.courseId);

      if (!student) {
        errors.push(`Row ${idx + 1}: Student with ID/Reg ${scoreIn.studentId} does not exist in the students database.`);
        return;
      }
      if (!course) {
        errors.push(`Row ${idx + 1}: Course with ID/Code ${scoreIn.courseId} does not exist in the courses database.`);
        return;
      }

      // Check for scores bounds
      if (scoreIn.score < 0 || scoreIn.score > 100) {
        errors.push(`Row ${idx + 1} (${student.fullName}): Score exceeds maximum allowed value of 100.`);
        return;
      }

      const metrics = computeScoreMetrics(scoreIn.score, scoreIn.courseId);
      
      const newScore: DBExaminationScore = {
        id: 'e_bulk_' + idx + '_' + Date.now(),
        ...scoreIn,
        totalScore: metrics.total,
        grade: metrics.grade,
        gradePoint: metrics.gradePoint,
        qualityPoints: metrics.qualityPoints,
        creditEarned: metrics.creditEarned,
        remark: metrics.remark,
        status: 'Pending'
      };

      computedScores.push(newScore);
      successCount++;
    });

    if (errors.length === 0 && computedScores.length > 0) {
      // Batch insert / replace
      setDbExaminationScores(prev => {
        // Filter out any duplicates that match studentId + courseId in our new batch
        const filtered = prev.filter(p => !computedScores.some(c => c.studentId === p.studentId && c.courseId === p.courseId));
        return [...computedScores, ...filtered];
      });
      logActivity(currentUser?.id || 'system', 'Bulk Scores Upload', `Successfully imported examination marks for ${successCount} courses.`);
    }

    return { successCount, errors };
  };

  const deleteExamScoreDB = (id: string) => {
    setDbExaminationScores(prev => prev.filter(e => e.id !== id));
    logActivity(currentUser?.id || 'system', 'Exam Score Deleted', `Deleted score ID: ${id}`);
  };

  const addTranscriptDB = (studentId: string, issuedBy: string): DBTranscript => {
    // Generate Serial Number TRANS/2026/00000X
    const year = new Date().getFullYear();
    const count = dbTranscripts.length + 1;
    const serial = String(count).padStart(6, '0');
    const transcriptNum = `TRANS/${year}/${serial}`;

    // Verify uniqueness
    const existing = dbTranscripts.find(t => t.transcriptNumber === transcriptNum);
    const finalTranscriptNum = existing ? `TRANS/${year}/${String(count + 1).padStart(6, '0')}` : transcriptNum;

    const newTranscript: DBTranscript = {
      id: 't_' + Date.now(),
      transcriptNumber: finalTranscriptNum,
      studentId,
      dateOfIssue: new Date().toISOString().split('T')[0],
      issuedBy
    };

    setDbTranscripts(prev => [newTranscript, ...prev]);
    const student = dbStudents.find(s => s.id === studentId);
    logActivity(currentUser?.id || 'system', 'Transcript Generated', `Generated academic transcript (${finalTranscriptNum}) for student ${student?.fullName || studentId}`);
    
    return newTranscript;
  };

  const autoPopulateDemoScores = (studentId: string) => {
    const student = dbStudents.find(s => s.id === studentId);
    if (!student) return;

    // Get all courses that belong to this student's programme
    const progCourses = dbCourses.filter(c => c.programmeId === student.programmeId);
    const targetCourses = progCourses.length > 0 ? progCourses : dbCourses;

    // Standard high-quality performance pattern matching the Kaduna DITEM standard
    const demoPerformancePatterns = [
      { score: 83 }, // Total 83 (A)
      { score: 72 }, // Total 72 (A)
      { score: 64 }, // Total 64 (B)
      { score: 62 }, // Total 62 (B)
      { score: 56 }, // Total 56 (C)
      { score: 71 }, // Total 71 (A)
      { score: 58 }, // Total 58 (C)
      { score: 64 }  // Total 64 (B)
    ];

    const newScores: DBExaminationScore[] = [];

    targetCourses.forEach((course, idx) => {
      const pattern = demoPerformancePatterns[idx % demoPerformancePatterns.length];
      const metrics = computeScoreMetrics(pattern.score, course.id);
      
      newScores.push({
        id: 'e_demo_' + course.id + '_' + studentId + '_' + Date.now() + '_' + idx,
        studentId,
        courseId: course.id,
        score: pattern.score,
        totalScore: metrics.total,
        grade: metrics.grade,
        gradePoint: metrics.gradePoint,
        qualityPoints: metrics.qualityPoints,
        creditEarned: metrics.creditEarned,
        remark: metrics.remark,
        status: 'Approved'
      });
    });

    // Replace scores
    setDbExaminationScores(prev => {
      const filtered = prev.filter(score => score.studentId !== studentId);
      return [...newScores, ...filtered];
    });

    // Make sure they have a transcript record issued
    const isTranscriptIssued = dbTranscripts.some(t => t.studentId === studentId);
    if (!isTranscriptIssued) {
      addTranscriptDB(studentId, currentUser?.name || 'Academic System');
    }

    logActivity(currentUser?.id || 'system', 'Demo Scores Populated', `Auto-populated realistic exam scores for student ${student.fullName}`);
  };

  const addCertificateDB = (studentId: string, issuedBy: string): DBCertificate => {
    // Generate Serial Number CERT/2026/00000X
    const year = new Date().getFullYear();
    const count = dbCertificates.length + 1;
    const serial = String(count).padStart(6, '0');
    const certificateNum = `CERT/${year}/${serial}`;

    // Verify uniqueness
    const existing = dbCertificates.find(c => c.certificateNumber === certificateNum);
    const finalCertificateNum = existing ? `CERT/${year}/${String(count + 1).padStart(6, '0')}` : certificateNum;

    // Create randomized unique hex verification string
    const verificationCode = 'DITEM-SEC-' + Math.random().toString(16).substring(2, 8).toUpperCase();

    const newCertificate: DBCertificate = {
      id: 'cer_' + Date.now(),
      certificateNumber: finalCertificateNum,
      studentId,
      verificationCode,
      dateOfIssue: new Date().toISOString().split('T')[0],
      issuedBy,
      status: 'Issued'
    };

    setDbCertificates(prev => [newCertificate, ...prev]);
    const student = dbStudents.find(s => s.id === studentId);
    logActivity(currentUser?.id || 'system', 'Certificate Issued', `Generated professional degree diploma certificate (${finalCertificateNum}) with SecCode ${verificationCode} for student ${student?.fullName || studentId}`);
    
    return newCertificate;
  };

  const updateCertificateStatusDB = (id: string, status: DBCertificate['status']) => {
    setDbCertificates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    logActivity(currentUser?.id || 'system', 'Certificate Status Changed', `Modified status of Certificate ID ${id} to: ${status}`);
  };

  const addDepartmentDB = (dept: Omit<DBDepartment, 'id'>) => {
    setDbDepartments(prev => [...prev, { ...dept, id: 'd_' + Date.now() }]);
    logActivity(currentUser?.id || 'system', 'Department Added', `Created new department: ${dept.name}`);
  };

  const addProgrammeDB = (prog: Omit<DBProgramme, 'id'>) => {
    setDbProgrammes(prev => [...prev, { ...prog, id: 'p_' + Date.now() }]);
    logActivity(currentUser?.id || 'system', 'Programme Added', `Created new study programme: ${prog.name}`);
  };

  const addSessionDB = (sess: Omit<DBSession, 'id'>) => {
    setDbSessions(prev => [...prev, { ...sess, id: 's_' + Date.now() }]);
    logActivity(currentUser?.id || 'system', 'Session Added', `Added session term: ${sess.name}`);
  };

  const updateGradingRules = (rules: GradingRule[]) => {
    setGradingRules(rules);
    
    // Proactively recompute ALL student score grades, points, and remarks immediately!
    // This perfectly supports "allow administrators to customize grading ranges" with live re-calculation
    setDbExaminationScores(prev => prev.map(score => {
      const total = score.ca + score.assignment + score.practical + score.midSemester + score.examination;
      let matched = rules.find(r => total >= r.minScore && total <= r.maxScore);
      if (!matched) matched = { grade: 'F', minScore: 0, maxScore: 44, point: 0, remark: 'Failed' };
      
      const course = dbCourses.find(c => c.id === score.courseId);
      const credits = course ? course.creditUnit : 3;
      const isPassed = matched.grade !== 'F';

      return {
        ...score,
        totalScore: total,
        grade: matched.grade,
        gradePoint: matched.point,
        creditEarned: isPassed ? credits : 0,
        remark: (isPassed ? 'PASSED' : 'FAILED') as 'PASSED' | 'FAILED'
      };
    }));

    logActivity(currentUser?.id || 'system', 'Grading Scale Customized', 'Institution grading range thresholds changed. Recalculated all transcripts.');
  };

  const logActivity = (userId: string, action: string, details: string) => {
    const user = dbUsers.find(u => u.id === userId);
    const newLog: DBAuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      userId,
      userEmail: user ? user.email : 'system_guest@ditem.edu',
      userRole: user ? user.role : 'Guest/System',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setDbAuditLogs(prev => [newLog, ...prev]);
  };

  // --- Backup & Restore Engine ---

  const backupDatabase = (): string => {
    const payload = {
      dbUsers,
      dbDepartments,
      dbProgrammes,
      dbSessions,
      dbSemesters,
      dbStudents,
      dbCourses,
      dbExaminationScores,
      dbTranscripts,
      dbCertificates,
      gradingRules,
      dbAuditLogs
    };
    logActivity(currentUser?.id || 'system', 'Database Backup', 'Full database export compiled to JSON.');
    return JSON.stringify(payload, null, 2);
  };

  const restoreDatabase = (jsonStr: string): boolean => {
    try {
      const payload = JSON.parse(jsonStr);
      if (payload.dbStudents && payload.dbCourses && payload.dbExaminationScores) {
        if (payload.dbUsers) setDbUsers(payload.dbUsers);
        if (payload.dbDepartments) setDbDepartments(payload.dbDepartments);
        if (payload.dbProgrammes) setDbProgrammes(payload.dbProgrammes);
        if (payload.dbSessions) setDbSessions(payload.dbSessions);
        if (payload.dbSemesters) setDbSemesters(payload.dbSemesters);
        if (payload.dbStudents) setDbStudents(payload.dbStudents);
        if (payload.dbCourses) setDbCourses(payload.dbCourses);
        if (payload.dbExaminationScores) setDbExaminationScores(payload.dbExaminationScores);
        if (payload.dbTranscripts) setDbTranscripts(payload.dbTranscripts);
        if (payload.dbCertificates) setDbCertificates(payload.dbCertificates);
        if (payload.gradingRules) setGradingRules(payload.gradingRules);
        if (payload.dbAuditLogs) setDbAuditLogs(payload.dbAuditLogs);
        
        logActivity(currentUser?.id || 'system', 'Database Restore', 'Successfully restored database state from external backup file.');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to restore database backup', e);
      return false;
    }
  };


  // ==========================================
  // --- Legacy Compatibility Logic & State ---
  // ==========================================

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
    
    // Register directly in legacy students list
    addStudent({
      name: `${app.firstName} ${app.surname}`,
      course: app.program,
      duration: app.duration,
      totalAmount: 45000, 
      amountPaid: 0
    });

    // Also register in the new RELATIONAL DB students table so they are fully linked!
    // Search department/programme
    const prog = dbProgrammes.find(p => p.name.toLowerCase().includes(app.program.toLowerCase())) || dbProgrammes[0];
    addStudentDB({
      registrationNumber: `DITEM/${prog.code}/2026/00` + (dbStudents.length + 10),
      admissionNumber: `ADM/2026/00` + (dbStudents.length + 10),
      matricNumber: `MAT/${prog.code}/2026/00` + (dbStudents.length + 10),
      studentPhotograph: app.pictureUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      fullName: `${app.firstName} ${app.surname}`.toUpperCase(),
      dateOfBirth: '2001-01-01',
      gender: 'Male',
      state: 'Kaduna',
      localGovernment: 'Kaduna North',
      departmentId: prog.departmentId,
      programmeId: prog.id,
      sessionId: 's2',
      graduationYear: '2026'
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
      dbUsers, dbDepartments, dbProgrammes, dbSessions, dbSemesters, dbStudents, dbCourses,
      dbExaminationScores, dbTranscripts, dbCertificates, dbAuditLogs, gradingRules,
      currentUser, loginUser, logoutUser, enable2FA,
      addStudentDB, updateStudentDB, deleteStudentDB,
      addCourseDB, updateCourseDB, deleteCourseDB,
      addExamScoreDB, addExamScoresBulkDB, deleteExamScoreDB,
      addTranscriptDB, autoPopulateDemoScores, addCertificateDB, updateCertificateStatusDB,
      addDepartmentDB, addProgrammeDB, addSessionDB,
      updateGradingRules, logActivity, backupDatabase, restoreDatabase,
      getStudentCalculatedGPA,

      // legacy support
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
