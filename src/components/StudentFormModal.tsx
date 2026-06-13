import React, { useState, useEffect } from 'react';
import { Student, SportType } from '../types';
import { SPORTS_DATA } from '../data/sports';
import { X, User, Plus, Check } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  studentToEdit?: Student | null;
  onClose: () => void;
  onSubmit: (studentData: Omit<Student, 'id' | 'dateAdded'>) => void;
}

const AVATAR_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Male 1' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Male 2' },
  { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', label: 'Male 3' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Female 1' },
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', label: 'Female 2' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', label: 'Female 3' },
];

export function StudentFormModal({ isOpen, studentToEdit, onClose, onSubmit }: StudentFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    gradeClass: 'Grade 10-A',
    age: 15,
    sport: 'Football' as SportType,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    avatarUrl: '',
    scores: {
      math: 80,
      science: 80,
      english: 80,
      sports: 80,
      art: 80,
    },
    remarks: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name,
        rollNumber: studentToEdit.rollNumber,
        gradeClass: studentToEdit.gradeClass,
        age: studentToEdit.age,
        sport: studentToEdit.sport,
        gender: studentToEdit.gender,
        avatarUrl: studentToEdit.avatarUrl || '',
        scores: { ...studentToEdit.scores },
        remarks: studentToEdit.remarks || '',
      });
    } else {
      // Set a random standard roll number placeholder initially
      const code = Math.floor(100 + Math.random() * 900);
      setFormData({
        name: '',
        rollNumber: `STU-${code}`,
        gradeClass: 'Grade 10-A',
        age: 15,
        sport: 'Football',
        gender: 'Male',
        avatarUrl: AVATAR_PRESETS[0].url,
        scores: {
          math: 80,
          science: 80,
          english: 80,
          sports: 80,
          art: 80,
        },
        remarks: '',
      });
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (formData.age < 5 || formData.age > 25) newErrors.age = 'Age should be between 5 and 25';

    // Validate scores (0 to 100)
    Object.entries(formData.scores).forEach(([sub, val]) => {
      const scoreVal = val as number;
      if (scoreVal === undefined || isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
        newErrors[`scores.${sub}`] = 'Score must be between 0 and 100';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScoreChange = (subject: string, value: number) => {
    // Ensure numerical limits
    const sanitizedVal = Math.min(100, Math.max(0, value || 0));
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [subject]: sanitizedVal,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-150 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              {studentToEdit ? 'Modify Student Record' : 'Register New Student'}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              Fill details, select sports participation, and record exam marks.
            </p>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Left Column: Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                Basic Credentials
              </h4>

              {/* Name Block */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Student Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="input-student-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name}</span>}
              </div>

              {/* Roll & Class Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Roll Number</label>
                  <input
                    id="input-roll-number"
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                    placeholder="e.g. STU-123"
                    className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-mono uppercase"
                  />
                  {errors.rollNumber && <span className="text-xs text-rose-500 mt-1 block">{errors.rollNumber}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Class / Division</label>
                  <select
                    id="select-grade-class"
                    value={formData.gradeClass}
                    onChange={(e) => handleInputChange('gradeClass', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Grade 9-A">Grade 9-A</option>
                    <option value="Grade 9-B">Grade 9-B</option>
                    <option value="Grade 9-C">Grade 9-C</option>
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 10-B">Grade 10-B</option>
                    <option value="Grade 10-C">Grade 10-C</option>
                    <option value="Grade 11-A">Grade 11-A</option>
                    <option value="Grade 11-B">Grade 11-B</option>
                    <option value="Grade 12-A">Grade 12-A</option>
                    <option value="Grade 12-B">Grade 12-B</option>
                  </select>
                </div>
              </div>

              {/* Age & Gender Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Age</label>
                  <input
                    id="input-age"
                    type="number"
                    min="5"
                    max="25"
                    required
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  {errors.age && <span className="text-xs text-rose-500 mt-1 block">{errors.age}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gender</label>
                  <select
                    id="select-gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Male">👦 Male</option>
                    <option value="Female">👧 Female</option>
                    <option value="Other">👥 Other / Non-Binary</option>
                  </select>
                </div>
              </div>

              {/* Sport picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Sports Division Selection</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(SPORTS_DATA).map((sport) => (
                    <button
                      key={sport.name}
                      id={`form-sport-btn-${sport.name}`}
                      type="button"
                      onClick={() => handleInputChange('sport', sport.name)}
                      className={`flex flex-col items-center py-2 px-1 border rounded-xl text-center transition-all ${
                        formData.sport === sport.name
                          ? 'border-indigo-500 bg-indigo-50/40 text-indigo-700 ring-2 ring-indigo-500/10'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                      }`}
                    >
                      <span className="text-xl mb-1">{sport.icon}</span>
                      <span className="text-[11px] font-semibold">{sport.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Subjects Academic Grades */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                Academic Grade Registry
              </h4>

              <div className="bg-gray-55/40 bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                {/* Mathematics */}
                <div className="flex items-center gap-3 justify-between">
                  <div className="w-1/2">
                    <span className="text-xs font-bold text-gray-700 block">📐 Mathematics</span>
                    <span className="text-[10px] text-gray-400">Algebra / calculus tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-mark-math"
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.scores.math}
                      onChange={(e) => handleScoreChange('math', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>

                {/* Science */}
                <div className="flex items-center gap-3 justify-between">
                  <div className="w-1/2">
                    <span className="text-xs font-bold text-gray-700 block">🧪 General Science</span>
                    <span className="text-[10px] text-gray-400">Physics, chemistry labs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-mark-science"
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.scores.science}
                      onChange={(e) => handleScoreChange('science', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>

                {/* English */}
                <div className="flex items-center gap-3 justify-between">
                  <div className="w-1/2">
                    <span className="text-xs font-bold text-gray-700 block">📖 English</span>
                    <span className="text-[10px] text-gray-400">Compositions / speech</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-mark-english"
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.scores.english}
                      onChange={(e) => handleScoreChange('english', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>

                {/* Sports Performance */}
                <div className="flex items-center gap-3 justify-between">
                  <div className="w-1/2">
                    <span className="text-xs font-bold text-gray-700 block">🏅 Physical Education</span>
                    <span className="text-[10px] text-gray-400">Agility / core sports drill</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-mark-sports"
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.scores.sports}
                      onChange={(e) => handleScoreChange('sports', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>

                {/* Art */}
                <div className="flex items-center gap-3 justify-between">
                  <div className="w-1/2">
                    <span className="text-xs font-bold text-gray-700 block">🎨 Fine Arts</span>
                    <span className="text-[10px] text-gray-400">Illustrations & crafts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-mark-art"
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.scores.art}
                      onChange={(e) => handleScoreChange('art', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>
              </div>

              {/* Remarks Box */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Remarks / Observation Notes</label>
                <textarea
                  id="textarea-remarks"
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Record key behavioural details or recommendations."
                  className="w-full p-3 bg-gray-55/40 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Profile Avatar Selection Preset Row */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Select Profile Persona Preset
            </label>
            <div className="grid grid-cols-6 gap-3 mb-3">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInputChange('avatarUrl', preset.url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    formData.avatarUrl === preset.url
                      ? 'border-indigo-500 ring-4 ring-indigo-500/10'
                      : 'border-transparent opacity-75 hover:opacity-100 hover:border-gray-200'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {formData.avatarUrl === preset.url && (
                    <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                      <div className="bg-white p-0.5 rounded-full">
                        <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Custom URL Field */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                Or paste a custom avatar photo link instead:
              </label>
              <input
                id="input-custom-avatar"
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-1.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-150 px-6 py-4 flex justify-end gap-3 shrink-0">
          <button
            id="cancel-modal-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-150 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            id="submit-form-btn"
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            {studentToEdit ? 'Save Changes' : 'Register Candidate'}
          </button>
        </div>
      </div>
    </div>
  );
}
