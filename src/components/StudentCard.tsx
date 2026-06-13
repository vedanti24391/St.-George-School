import React from 'react';
import { Student } from '../types';
import { SPORTS_DATA } from '../data/sports';
import { calculateAverage, calculateAverageGpa, getPassFailStatus } from '../utils';
import { Eye, Edit, Trash2, Calendar, Award, User, Layers } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onViewReport: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onViewReport, onEdit, onDelete }) => {
  const sportInfo = SPORTS_DATA[student.sport];
  const gpa = calculateAverageGpa(student.scores);
  const average = calculateAverage(student.scores);
  const passStatus = getPassFailStatus(student.scores);

  // Initialize a nice fallback for the student image if no avatar provided
  const avatarToUse = student.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`;

  return (
    <div
      id={`student-card-${student.id}`}
      className="bg-gradient-to-b from-white to-slate-50/50 rounded-2xl overflow-hidden border border-slate-200/90 shadow-3xs hover:shadow-sm hover:border-slate-300 hover:shadow-indigo-100/30 transition-all duration-300 flex flex-col h-full group hover:-translate-y-0.5"
    >
      {/* Card Header Background reflecting Sport Choice */}
      <div className="relative h-32 overflow-hidden bg-slate-100">
        <img
          src={sportInfo?.image}
          alt={student.sport}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent"></div>
        
        {/* Sport badge overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/95 border border-white/20 shadow-xs ${sportInfo?.textColor}`}>
            <span>{sportInfo?.icon}</span>
            <span>{student.sport}</span>
          </span>
        </div>

        {/* Grade overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
          <div className="mr-2 truncate">
            <span className="text-xs font-medium text-gray-300 block tracking-wider uppercase">{student.rollNumber}</span>
            <h3 className="font-bold text-lg leading-tight truncate">{student.name}</h3>
          </div>
          <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider border ${passStatus.passed ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-rose-500/90 text-white border-rose-400'}`}>
            {passStatus.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Student Profile Info Row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative shrink-0">
              <img
                src={avatarToUse}
                alt={student.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border-2 border-white ring-2 ring-slate-100"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center text-[10px] shadow-xs border border-slate-100">
                {student.gender === 'Male' ? '👦' : student.gender === 'Female' ? '👧' : '👤'}
              </span>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">{student.gradeClass}</span>
                <span className="text-slate-200">•</span>
                <span className="font-medium">{student.age} yrs</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Joined {student.dateAdded}</span>
              </div>
            </div>
          </div>

          {/* Academic Overview Header */}
          <div className="border-t border-slate-100 pt-4 mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold mb-3 tracking-wider">
              <span>Academic Performance</span>
              <span className="text-slate-700 font-extrabold">{average}% Average</span>
            </div>

            {/* Micro subject scores bar graphs */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium text-slate-600">Math & Science</span>
                <span className="font-mono text-slate-800 font-bold">
                  {student.scores.math} / {student.scores.science}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-1 bg-gradient-to-r from-slate-100 to-slate-200">
                <div
                  className="bg-indigo-600 h-full rounded-l-full transition-all duration-500"
                  style={{ width: `${student.scores.math}%` }}
                ></div>
                <div
                  className="bg-sky-500 h-full rounded-r-full transition-all duration-500"
                  style={{ width: `${student.scores.science}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 mt-2">
                <span className="font-medium text-slate-600">English & Sports</span>
                <span className="font-mono text-slate-800 font-bold">
                  {student.scores.english} / {student.scores.sports}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-1 bg-gradient-to-r from-slate-100 to-slate-200">
                <div
                  className="bg-purple-600 h-full rounded-l-full transition-all duration-500"
                  style={{ width: `${student.scores.english}%` }}
                ></div>
                <div
                  className="bg-amber-500 h-full rounded-r-full transition-all duration-500"
                  style={{ width: `${student.scores.sports}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* GPA Highlight Badge */}
        <div className="bg-slate-50/70 border border-slate-150 rounded-2xl px-4 py-3 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500/10 p-1.5 rounded-lg text-amber-600">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-600">Calculated GPA</span>
          </div>
          <span className="text-sm font-extrabold text-slate-800 font-mono bg-white border border-slate-200 py-1 px-2.5 rounded-xl shadow-xs">
            {gpa.toFixed(2)}
          </span>
        </div>

        {/* Interactive Operations Buttons */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 mt-1">
          <button
            id={`view-report-btn-${student.id}`}
            onClick={() => onViewReport(student)}
            className="flex-grow-1 flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-colors shadow-sm bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Report Card</span>
          </button>
          
          <button
            id={`edit-student-btn-${student.id}`}
            onClick={() => onEdit(student)}
            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all"
            title="Edit Details"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            id={`delete-student-btn-${student.id}`}
            onClick={() => onDelete(student.id)}
            className="inline-flex items-center justify-center p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
            title="Remove Student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
