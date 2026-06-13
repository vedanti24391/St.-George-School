import { SubjectScores } from './types';

export function getGradeAndGpa(score: number): { grade: string; gpa: number; color: string; bg: string } {
  if (score >= 90) return { grade: 'A+', gpa: 4.0, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100/70 dark:bg-emerald-950/40' };
  if (score >= 80) return { grade: 'A', gpa: 3.5, color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-100/70 dark:bg-teal-950/40' };
  if (score >= 70) return { grade: 'B', gpa: 3.0, color: 'text-sky-700 dark:text-sky-400', bg: 'bg-sky-100/70 dark:bg-sky-950/40' };
  if (score >= 60) return { grade: 'C', gpa: 2.0, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100/70 dark:bg-amber-950/40' };
  if (score >= 50) return { grade: 'D', gpa: 1.0, color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100/70 dark:bg-orange-950/40' };
  return { grade: 'F', gpa: 0.0, color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100/70 dark:bg-rose-950/40' };
}

export function calculateAverage(scores: SubjectScores): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 10) / 10;
}

export function calculateAverageGpa(scores: SubjectScores): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  const totalGpa = values.reduce((sum, score) => sum + getGradeAndGpa(score).gpa, 0);
  return Math.round((totalGpa / values.length) * 100) / 100;
}

export function getPassFailStatus(scores: SubjectScores): { passed: boolean; label: string; bg: string; text: string } {
  const failingSubjects = Object.entries(scores).filter(([_, score]) => score < 50);
  const passed = failingSubjects.length === 0;
  return {
    passed,
    label: passed ? 'PASSED' : `FAILING (${failingSubjects.length} Subj.)`,
    bg: passed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200',
    text: passed ? 'text-emerald-700' : 'text-rose-700',
  };
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
}
