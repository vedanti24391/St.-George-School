import React, { useState, useEffect } from 'react';
import { Student, SubjectScores } from '../types';
import { SPORTS_DATA } from '../data/sports';
import { calculateAverage, calculateAverageGpa, getPassFailStatus, getGradeAndGpa } from '../utils';
import { X, Printer, Calendar, ShieldAlert, Award, FileText, CheckCircle2, ChevronRight, Edit2, Check } from 'lucide-react';
import schoolLogo from '../../school.jpg';

interface ReportCardModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onUpdateScores: (studentId: string, updatedScores: SubjectScores, updatedRemarks: string) => void;
}

export function ReportCardModal({ isOpen, student, onClose, onUpdateScores }: ReportCardModalProps) {
  const [activeTab, setActiveTab] = useState<'report' | 'certificate'>('report');
  const [localScores, setLocalScores] = useState<SubjectScores>({
    math: 0,
    science: 0,
    english: 0,
    sports: 0,
    art: 0,
  });
  const [localRemarks, setLocalRemarks] = useState('');
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);

  useEffect(() => {
    if (student) {
      setLocalScores({ ...student.scores });
      setLocalRemarks(student.remarks || '');
      setIsEditingRemarks(false);
      setActiveTab('report');
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const sportInfo = SPORTS_DATA[student.sport];
  
  // Calculations based on local state (for real-time sliders preview!)
  const average = calculateAverage(localScores);
  const averageGpa = calculateAverageGpa(localScores);
  const passStatus = getPassFailStatus(localScores);

  const handleScoreSliderChange = (subKey: keyof SubjectScores, val: number) => {
    const updated = {
      ...localScores,
      [subKey]: val,
    };
    setLocalScores(updated);
    // Propagate updates instantly so the main CRUD database stays synchronized flawlessly
    onUpdateScores(student.id, updated, localRemarks);
  };

  const handleRemarksBlurOrSave = () => {
    setIsEditingRemarks(false);
    onUpdateScores(student.id, localScores, localRemarks);
  };

  // Triggering the standard browser print window
  const handlePrint = () => {
    window.print();
  };

  const subjectsMapping: { key: keyof SubjectScores; label: string; details: string; icon: string; teacher: string }[] = [
    { key: 'math', label: 'Mathematics', details: 'Analytical reasoning & algebra', icon: '📐', teacher: 'Prof. Rajesh Sharma' },
    { key: 'science', label: 'General Science', details: 'Scientific inquiry & laboratory', icon: '🧪', teacher: 'Dr. Anjali Desai' },
    { key: 'english', label: 'English', details: 'Compositions, syntax & oral skills', icon: '📖', teacher: 'Mr. Vikram Malhotra' },
    { key: 'sports', label: 'Physical Education', details: 'Agility, team drills & athletics', icon: '🏅', teacher: 'Coach Amit Singh' },
    { key: 'art', label: 'Fine Arts', details: 'Illustrative theory & execution', icon: '🎨', teacher: 'Mrs. Priya Patel' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row max-h-[92vh]">
        
        {/* LEFT COLUMN: Live Parameter Editor Controls */}
        <div className="lg:w-80 bg-slate-50 border-r border-slate-150 p-6 overflow-y-auto flex flex-col justify-between shrink-0 print:hidden select-none">
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                Academic Sandbox
              </span>
              <h4 className="text-base font-extrabold text-gray-900 tracking-tight">
                Live Score Calibration
              </h4>
              <p className="text-gray-500 text-xs mt-1">
                Drag the sliders to alter grades in real time and preview the effects on GPA & metrics instantly.
              </p>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-4">
              {subjectsMapping.map((subj) => (
                <div key={subj.key} className="space-y-1 bg-white p-3 rounded-xl border border-gray-100 shadow-3xs">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1">
                      <span>{subj.icon}</span>
                      <span className="truncate max-w-[120px]">{subj.label}</span>
                    </span>
                    <span className="font-mono text-gray-900 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      {localScores[subj.key]}/100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localScores[subj.key]}
                    onChange={(e) => handleScoreSliderChange(subj.key, parseInt(e.target.value) || 0)}
                    className="w-full accent-indigo-600 h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>0</span>
                    <span>Fail &lt; 50</span>
                    <span>100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice bottom */}
          <div className="mt-6 pt-5 border-t border-gray-105 border-dashed border-gray-250 border-gray-200">
            <div className="flex items-start gap-2 text-xs text-indigo-700 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-tight text-[11px]">
                Scores are automatically saved to storage upon adjustment.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Report Card/Certificate Preview Stage */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          
          {/* Header tabs / prints */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white print:hidden">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                id="tab-report-card"
                onClick={() => setActiveTab('report')}
                className={`inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'report'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Transcript Sheet</span>
              </button>
              <button
                id="tab-excellence-cert"
                onClick={() => setActiveTab('certificate')}
                disabled={average < 75}
                className={`inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  average < 75
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : activeTab === 'certificate'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-gray-500 hover:text-emerald-700'
                }`}
                title={average < 75 ? 'Requires average >= 75%' : 'Excellece Certificate'}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Excellence Certificate</span>
                {average >= 75 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="print-report-btn"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              
              <button
                id="close-report-modal"
                onClick={onClose}
                className="p-1 px-[7px] bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Stage Frame */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50/20 print:p-0 print:bg-white min-h-[500px]">
            
            {/* VIEW 1: TRANSCRIPT REPORT CARD */}
            {activeTab === 'report' && (
              <div id="school-transcript-print-area" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs max-w-2xl mx-auto border-double border-4 border-indigo-100/90 print:border-none print:shadow-none print:p-1">
                
                {/* School Letterhead */}
                <div className="text-center pb-6 border-b-2 border-indigo-120 border-indigo-100 mb-6 relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <img
                      src={schoolLogo}
                      alt="St. George School Crest"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                    St. George School
                  </h2>
                  <p className="text-[10px] text-gray-400 tracking-wider uppercase font-bold mt-0.5">
                    102 Academy Road, St. George Campus • Est. 1994
                  </p>
                  <div className="absolute right-0 top-0 text-[9px] font-bold text-gray-400 bg-gray-100/80 p-1 rounded font-mono border border-gray-150 print:hidden select-none">
                    OFFICIAL STATE DATA
                  </div>
                </div>

                {/* Registry Demographics */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium uppercase text-[9px] tracking-wider">Candidate Name</span>
                    <span className="font-extrabold text-gray-900">{student.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium uppercase text-[9px] tracking-wider">Roll Identification</span>
                    <span className="font-mono font-bold text-indigo-700">{student.rollNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium uppercase text-[9px] tracking-wider">Class / Grade</span>
                    <span className="font-semibold text-gray-800">{student.gradeClass}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium uppercase text-[9px] tracking-wider">Primary Athletic field</span>
                    <span className="font-semibold text-emerald-800 inline-flex items-center gap-1">
                      <span>{sportInfo?.icon}</span>
                      <span>{student.sport}</span>
                    </span>
                  </div>
                </div>

                {/* Grades Table */}
                <div className="border border-gray-150 rounded-2xl overflow-hidden mb-6 shadow-3xs bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-indigo-950/5 font-semibold text-gray-600 border-b border-gray-150">
                        <th className="py-2.5 px-4 w-1/2">Subject Module</th>
                        <th className="py-2.5 px-3 text-center">Max Marks</th>
                        <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                        <th className="py-2.5 px-3 text-center">Symbolic Grade</th>
                        <th className="py-2.5 px-3 text-center">Grade Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subjectsMapping.map((subj) => {
                        const score = localScores[subj.key];
                        const gradeData = getGradeAndGpa(score);
                        return (
                          <tr key={subj.key} className="hover:bg-gray-50/30">
                            <td className="py-2.5 px-4 animate-fade-in">
                              <div className="font-bold text-gray-800">{subj.label}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {subj.details} • <span className="text-indigo-600 font-semibold">{subj.teacher}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-gray-400">100</td>
                            <td className="py-2.5 px-3 text-center font-bold font-mono text-gray-900">{score}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded font-extrabold text-[11px] font-mono ${gradeData.bg} ${gradeData.color}`}>
                                {gradeData.grade}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-semibold font-mono text-gray-700">{gradeData.gpa.toFixed(1)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary Metrics block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wider">Combined Total</span>
                    <span className="text-xl font-extrabold text-gray-900 font-mono">
                      {(Object.values(localScores) as number[]).reduce((a, b) => a + b, 0)} <span className="text-xs text-gray-400 font-normal">/ 500</span>
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wider">Overall Average</span>
                    <span className="text-xl font-extrabold text-indigo-700 font-mono">
                      {average}%
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wider">Weighted GPA</span>
                    <span className="text-xl font-extrabold text-gray-900 font-mono inline-flex items-center gap-1 justify-center">
                      <span>🏅</span>
                      <span>{averageGpa.toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                {/* Remarks & Instructor sign-off block */}
                <div className="border border-gray-200 border-dashed rounded-2xl p-4.5 bg-gray-50/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Academic Supervisor Review
                      </span>
                      <button
                        id="toggle-edit-remarks-btn"
                        onClick={() => {
                          if (isEditingRemarks) handleRemarksBlurOrSave();
                          else setIsEditingRemarks(true);
                        }}
                        className="print:hidden inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
                      >
                        {isEditingRemarks ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Save Notes</span>
                          </>
                        ) : (
                          <>
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Notes</span>
                          </>
                        )}
                      </button>
                    </div>
                    {isEditingRemarks ? (
                      <textarea
                        id="textarea-live-remarks"
                        rows={3}
                        value={localRemarks}
                        onChange={(e) => setLocalRemarks(e.target.value)}
                        onBlur={handleRemarksBlurOrSave}
                        autoFocus
                        className="w-full text-xs p-2 border border-indigo-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed text-xs italic">
                        "{localRemarks || 'No academic review recorded for this evaluation terminal.'}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-100 border-dashed">
                    <div>
                      <span className="text-[10px] text-gray-300 font-mono block">Status Verdict</span>
                      <span className={`text-[11px] font-extrabold tracking-widest ${passStatus.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {passStatus.passed ? '★ ELIGIBLE EXCEL' : '✏️ REMEDIAL SESSIONS ADVISED'}
                      </span>
                    </div>

                    {/* Authorized Signature Stamp */}
                    <div className="text-center min-w-[130px]">
                      <div className="font-serif italic text-sm text-indigo-900 border-b border-gray-300 pb-1 px-2 select-none">
                        Fr. Arthur Pendelton
                      </div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold block mt-1">Registrar Signature</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: BEAUTIFUL CALLIGRAPHIC ACHIEVEMENT CERTIFICATE */}
            {activeTab === 'certificate' && average >= 75 && (
              <div id="award-certificate-print-area" className="bg-white border-8 border-amber-100 rounded-3xl p-8 shadow-md max-w-2xl mx-auto shadow-inner relative flex flex-col justify-between aspect-4/3 border-amber-200/50 print:border-none print:shadow-none bg-gradient-to-br from-amber-50/20 via-white to-amber-50/10 text-center select-none">
                
                {/* Vintage/Formal Corner Accents */}
                <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-amber-600/30 rounded-tl-lg"></div>
                <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-amber-600/30 rounded-tr-lg"></div>
                <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-amber-600/30 rounded-bl-lg"></div>
                <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-amber-600/30 rounded-br-lg"></div>

                <div className="my-auto space-y-5">
                  <div className="flex items-center justify-center text-amber-500 mb-2">
                    <Award className="w-16 h-16 stroke-[1.25]" />
                  </div>
                  
                  <div>
                    <span className="font-serif italic text-xs text-amber-800 block uppercase tracking-widest font-bold">
                      St. George School
                    </span>
                    <h1 className="text-2xl font-serif font-bold text-gray-950 mt-1 uppercase tracking-tight">
                      Certificate of Excellence
                    </h1>
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent w-48 mx-auto mt-2.5"></div>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-400 block uppercase tracking-wider">This diploma of honor is awarded to</span>
                    <h3 className="text-xl font-serif font-black text-gray-900 my-1 font-bold">
                      {student.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed italic mt-2.5">
                      For exhibiting an outstanding GPA average of <span className="font-bold text-amber-700">{averageGpa.toFixed(2)} / 4.0</span> coupled with disciplined core participation in the <span className="font-bold text-gray-900">{student.sport}</span> division.
                    </p>
                  </div>

                  <div className="flex justify-between items-end max-w-md mx-auto pt-8 border-t border-gray-100 text-xs">
                    <div className="text-center">
                      <span className="font-mono text-[10px] text-gray-600 font-bold block">{student.dateAdded}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wide border-t border-gray-150 pt-1 mt-1 block">Date of Registry</span>
                    </div>

                    <div className="w-16 h-16 bg-amber-500/10 rounded-full border border-amber-300/30 flex items-center justify-center text-rose-700">
                      🏅
                    </div>

                    <div className="text-center">
                      <span className="font-serif italic text-xs text-amber-900 block pb-0.5 border-b border-gray-150">Arthur Pendelton</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wide mt-1 block">Head Dean Academy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>

        </div>

      </div>
    </div>
  );
}
