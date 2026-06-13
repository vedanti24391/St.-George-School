export type SportType = 'Football' | 'Basketball' | 'Tennis' | 'Swimming' | 'Cricket' | 'Running';

export interface SubjectScores {
  math: number;
  science: number;
  english: number;
  sports: number;
  art: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  gradeClass: string;
  age: number;
  sport: SportType;
  gender: 'Male' | 'Female' | 'Other';
  avatarUrl?: string;
  scores: SubjectScores;
  remarks: string;
  dateAdded: string;
}

export interface SportInfo {
  name: SportType;
  image: string;
  icon: string;
  color: string;
  textColor: string;
  borderColor: string;
}
