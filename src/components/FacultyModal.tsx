import React from 'react';
import { TEACHERS_DATA, Teacher } from '../data/teachers';
import { X, Mail, BookOpen, Award, CheckCircle } from 'lucide-react';

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FacultyModal({ isOpen, onClose }: FacultyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in animate-duration-150">
      <div 
        id="faculty-modal-container"
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Block with background visual effect */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <h3 className="text-lg font-black tracking-tight">St. George Academy Faculty Directory</h3>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Meet our five highly qualified Indian academic and athletic department mentors.
            </p>
          </div>
          <button
            id="close-faculty-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-100 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Block with Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEACHERS_DATA.map((teacher: Teacher) => (
              <div 
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* 1:1 Aspect ratio image frame */}
                <div className="aspect-square w-full relative bg-slate-100 overflow-hidden group">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {teacher.experience}
                  </div>
                </div>

                {/* Teacher Metadata Content */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
                      {teacher.subject}
                    </span>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">
                      {teacher.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {teacher.bio}
                    </p>
                  </div>

                  {/* Mail & Verification indicators */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <a
                      href={`mailto:${teacher.email}`}
                      className="flex items-center gap-1.5 hover:text-indigo-600 font-bold transition-all text-[11px] truncate max-w-[170px]"
                      title={`Email ${teacher.name}`}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </a>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-4 border-t border-slate-150 bg-white flex items-center justify-between text-[11px] text-slate-400 font-medium shrink-0">
          <p>© St. George Academy Academic Board (SGE-2026)</p>
          <p className="font-bold text-indigo-700 uppercase tracking-wider">Education Team</p>
        </div>
      </div>
    </div>
  );
}
