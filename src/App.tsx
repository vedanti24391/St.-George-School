/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, SportType, SubjectScores } from './types';
import { SEED_STUDENTS, SPORTS_DATA } from './data/sports';
import { DashboardStats } from './components/DashboardStats';
import { StudentCard } from './components/StudentCard';
import { StudentFormModal } from './components/StudentFormModal';
import { ReportCardModal } from './components/ReportCardModal';
import { FacultyModal } from './components/FacultyModal';
import { GraduationCap, Plus, Search, Filter, RotateCcw, SlidersHorizontal, ArrowUpDown, ChevronDown, CheckCircle2 } from 'lucide-react';
import schoolLogo from '../school.jpg';

const LOCAL_STORAGE_KEY = 'st_george_academy_indian_school_v1';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('All');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('gpa-desc');

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [inspectingStudent, setInspectingStudent] = useState<Student | null>(null);

  const [isFacultyOpen, setIsFacultyOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Initialize students from LocalStorage or seed data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setStudents(JSON.parse(stored));
      } else {
        setStudents(SEED_STUDENTS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_STUDENTS));
      }
    } catch (e) {
      console.error('Failed to load storage, using seed data', e);
      setStudents(SEED_STUDENTS);
    }
  }, []);

  const triggerAlert = (text: string, type: 'success' | 'info' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // Synchronize dynamic student list updates to LocalStorage safely
  const updateStudentsList = (updatedList: Student[]) => {
    setStudents(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // CRUD Operation handlers
  const handleAddOrEditStudent = (formData: Omit<Student, 'id' | 'dateAdded'>) => {
    if (editingStudent) {
      // Edit operation
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              ...formData,
              // retain id and joining date
              id: s.id,
              dateAdded: s.dateAdded,
            }
          : s
      );
      updateStudentsList(updated);
      triggerAlert(`Successfully revised ${formData.name}'s profile and marks.`);
      
      // If we are currently inspecting the report card of this active student, refresh inspecting state
      if (inspectingStudent && inspectingStudent.id === editingStudent.id) {
        setInspectingStudent({
          ...inspectingStudent,
          ...formData,
        });
      }
    } else {
      // Create operation
      const newStudent: Student = {
        ...formData,
        id: `stud-${Date.now()}`,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      updateStudentsList([newStudent, ...students]);
      triggerAlert(`Registered ${formData.name} in standard sports curriculum.`);
    }

    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    if (!target) return;

    const confirmed = window.confirm(`Are you absolutely sure you want to remove student "${target.name}"?`);
    if (confirmed) {
      const remaining = students.filter((s) => s.id !== id);
      updateStudentsList(remaining);
      triggerAlert(`Successfully deleted student index reference and record.`, 'info');
    }
  };

  const handleUpdateStudentScores = (studentId: string, updatedScores: SubjectScores, updatedRemarks: string) => {
    const updated = students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            scores: { ...updatedScores },
            remarks: updatedRemarks,
          }
        : s
    );
    // Silent update to preserve state during sandboxed slide controls
    setStudents(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleResetRegistryOption = () => {
    const confirmed = window.confirm('Reset student registry back to original demonstration data? This overrides custom adjustments.');
    if (confirmed) {
      setStudents(SEED_STUDENTS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_STUDENTS));
      triggerAlert('Reverted registry to standard demo athletes data.', 'info');
    }
  };

  // Filter students based on state choices
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSport = selectedSportFilter === 'All' || s.sport === selectedSportFilter;
    const matchesGender = selectedGenderFilter === 'All' || s.gender === selectedGenderFilter;

    return matchesSearch && matchesSport && matchesGender;
  });

  // Calculate Average GPA helper for sorting
  const getAvgGpa = (scores: SubjectScores) => {
    const values = Object.values(scores);
    const totalGpa = values.reduce((sum, val) => {
      if (val >= 90) return sum + 4.0;
      if (val >= 80) return sum + 3.5;
      if (val >= 70) return sum + 3.0;
      if (val >= 60) return sum + 2.0;
      if (val >= 50) return sum + 1.0;
      return sum;
    }, 0);
    return totalGpa / values.length;
  };

  // Calculate Average Score percentage helper for sorting
  const getAvgScore = (scores: SubjectScores) => {
    const values = Object.values(scores);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  // Sort filtered output
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (selectedSort) {
      case 'gpa-desc':
        return getAvgGpa(b.scores) - getAvgGpa(a.scores);
      case 'gpa-asc':
        return getAvgGpa(a.scores) - getAvgGpa(b.scores);
      case 'avg-desc':
        return getAvgScore(b.scores) - getAvgScore(a.scores);
      case 'name-az':
        return a.name.localeCompare(b.name);
      case 'name-za':
        return b.name.localeCompare(a.name);
      case 'date-newest':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="h-screen w-full bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      
      {/* Header Navigation consistent with Professional Polish with a crisp border */}
      <header className="h-16 flex items-center justify-between px-8 bg-blue-200 border-b border-blue-300 shrink-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-100">
            <img
              src={schoolLogo}
              alt="St. George School Crest"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-800 leading-none block">St. George School</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Varsity Academic Portal</span>
          </div>
        </div>

        {/* Global info or brief counter overlay */}
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Academic Year</div>
            <div className="text-xs font-bold text-slate-800">2026 Season</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-indigo-700 ring-2 ring-indigo-50">
            ST
          </div>
        </div>
      </header>

      {/* Main Content Layout with interactive Sidebar and central directory */}
      <main className="flex-grow flex overflow-hidden">
        
        {/* Sidebar Controls Panel */}
        <nav className="w-72 border-r border-slate-200 bg-white p-6 flex flex-col justify-between shrink-0 overflow-y-auto select-none print:hidden shadow-3xs">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Registry Search & Filter</h3>
              
              {/* Search input field */}
              <div className="relative mb-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="search-students-input"
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>

              {/* Athletic discipline select field */}
              <div className="space-y-1.5 mb-5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sport Filter</label>
                <select
                  id="filter-sport-select"
                  value={selectedSportFilter}
                  onChange={(e) => setSelectedSportFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer transition-all"
                >
                  <option value="All">All Sports</option>
                  {Object.keys(SPORTS_DATA).map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Filter select field */}
              <div className="space-y-1.5 mb-5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gender Stream</label>
                <select
                  id="filter-gender-select"
                  value={selectedGenderFilter}
                  onChange={(e) => setSelectedGenderFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer transition-all"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">👦 Boys</option>
                  <option value="Female">👧 Girls</option>
                  <option value="Other">👥 Other / Non-Binary</option>
                </select>
              </div>

              {/* Sorting order selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sorting Order</label>
                <select
                  id="sort-criteria-select"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer transition-all"
                >
                  <option value="gpa-desc">Highest GPA (Weighted)</option>
                  <option value="gpa-asc">Lowest GPA (Weighted)</option>
                  <option value="avg-desc">Highest Marks % (Simple Avg)</option>
                  <option value="name-az">Student Name (A to Z)</option>
                  <option value="name-za">Student Name (Z to A)</option>
                  <option value="date-newest">Recently Registered First</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Database Options</h3>
              <button
                id="reset-demo-btn"
                onClick={handleResetRegistryOption}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Reset database to seed defaults"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restore Seed Defaults</span>
              </button>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Faculty & Teachers</h3>
              <button
                id="open-faculty-btn"
                onClick={() => setIsFacultyOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 rounded-xl text-xs font-bold border border-indigo-100 transition-all cursor-pointer"
                title="Show school faculty team"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Meet Our Teachers</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              id="add-student-trigger"
              onClick={() => {
                setEditingStudent(null);
                setIsFormOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:shadow-xl transition-all cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4 text-white stroke-[2.5]" />
              <span>Add New Student</span>
            </button>
          </div>
        </nav>

        {/* Central main content roster */}
        <section className="flex-grow flex flex-col justify-between overflow-y-auto p-8 bg-slate-50">
          <div className="flex-1">
            
            {/* Stage title block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Student Directory</h1>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  Displaying {filteredStudents.length} of {students.length} students enrolled in sports curriculum.
                </p>
              </div>
            </div>

            {/* Alert banners */}
            {alertMessage && (
              <div
                id="status-alert"
                className="mb-6 flex items-center gap-2.5 px-4.5 py-3 border rounded-2xl text-xs font-semibold animate-fade-in transition-all bg-emerald-50 text-emerald-800 border-emerald-100 shadow-3xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{alertMessage.text}</span>
              </div>
            )}

            {/* Stats Dashboard header section */}
            <DashboardStats students={students} />

            {/* Student grid main card drawer / Stage Grid */}
            {sortedStudents.length === 0 ? (
              <div
                id="empty-registry-stage"
                className="min-h-[300px] flex flex-col items-center justify-center p-10 bg-white border border-slate-205 border-slate-200 rounded-3xl text-center shadow-sm"
              >
                <div className="bg-indigo-50/50 p-5 rounded-full mb-4 text-indigo-500">
                  <GraduationCap className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">No Matching Students Found</h3>
                <p className="text-slate-400 text-xs max-w-sm mt-1.5 mb-5 font-medium">
                  We couldn't locate any candidate profile matching those specific keywords. Try reducing or resetting filters.
                </p>
                <button
                  id="clear-all-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSportFilter('All');
                    setSelectedGenderFilter('All');
                    setSelectedSort('gpa-desc');
                  }}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Filter Queries</span>
                </button>
              </div>
            ) : (
              /* RESPONSIVE CARDS GRID */
              <div id="students-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedStudents.map((stud) => (
                  <StudentCard
                    key={stud.id}
                    student={stud}
                    onViewReport={(s) => {
                      setInspectingStudent(s);
                      setIsReportOpen(true);
                    }}
                    onEdit={(s) => {
                      setEditingStudent(s);
                      setIsFormOpen(true);
                    }}
                    onDelete={handleDeleteStudent}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer inside main layout for neat bento look */}
          <footer className="mt-12 pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-400 font-medium text-xs">
            <p>© 2026 St. George School. Powered by Varsity Academic Sandbox.</p>
            <p className="hidden sm:block">Status: Live Sync 🟢</p>
          </footer>
        </section>
      </main>

      {/* 1. STUDENT REGISTRATION & FORM MODAL (CRUD Add/Update) */}
      <StudentFormModal
        isOpen={isFormOpen}
        studentToEdit={editingStudent}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleAddOrEditStudent}
      />

      {/* 2. SCHOOL TRANSCRIPT AND CERTIFICATE VIEWER MODAL */}
      <ReportCardModal
        isOpen={isReportOpen}
        student={inspectingStudent}
        onClose={() => {
          setIsReportOpen(false);
          setInspectingStudent(null);
        }}
        onUpdateScores={handleUpdateStudentScores}
      />

      {/* 3. SCHOOL FACULTY DIRECTORY MODAL */}
      <FacultyModal
        isOpen={isFacultyOpen}
        onClose={() => setIsFacultyOpen(false)}
      />
    </div>
  );
}

