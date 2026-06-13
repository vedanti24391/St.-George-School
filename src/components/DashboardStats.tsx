import { Student } from '../types';
import { calculateAverageGpa } from '../utils';
import { Users, TrendingUp, Sparkles, Trophy, ShieldCheck } from 'lucide-react';

interface DashboardStatsProps {
  students: Student[];
}

export function DashboardStats({ students }: DashboardStatsProps) {
  const totalStudents = students.length;

  // Calculate cumulative GPA
  const overallGpa = totalStudents > 0
    ? (students.reduce((sum, s) => sum + calculateAverageGpa(s.scores), 0) / totalStudents).toFixed(2)
    : '0.00';

  // Calculate sports participation popularity
  const sportCounts: Record<string, number> = {};
  students.forEach((s) => {
    sportCounts[s.sport] = (sportCounts[s.sport] || 0) + 1;
  });
  let topSport = 'None';
  let topCount = 0;
  Object.entries(sportCounts).forEach(([sport, count]) => {
    if (count > topCount) {
      topSport = sport;
      topCount = count;
    }
  });

  // Count perfect scores (any student with a subject score of 100) or exceptional achievers (avg gpa >= 3.8)
  const elitePerformers = students.filter((s) => {
    return Object.values(s.scores).some((score) => score >= 98);
  }).length;

  // Calculate Passing Rate (no subjects failed, where passing is >= 50)
  const passingStudents = students.filter((s) => {
    return Object.values(s.scores).every((score) => score >= 50);
  }).length;
  const passingRate = totalStudents > 0
    ? Math.round((passingStudents / totalStudents) * 100)
    : 0;

  const stats = [
    {
      id: 'total-students',
      label: 'Enrolled Athletes',
      value: totalStudents,
      subtext: 'Active standard records',
      icon: Users,
      color: 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-950/50',
      bgGradient: 'from-white via-white/95 to-indigo-50/40 border-indigo-100 hover:border-indigo-200/80 shadow-indigo-100/20',
    },
    {
      id: 'overall-gpa',
      label: 'Average Class GPA',
      value: `${overallGpa} / 4.0`,
      subtext: 'All subjects consolidated',
      icon: TrendingUp,
      color: 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-950/50',
      bgGradient: 'from-white via-white/95 to-emerald-50/40 border-emerald-100 hover:border-emerald-200/80 shadow-emerald-100/20',
    },
    {
      id: 'top-sport',
      label: 'Dominant Sport Program',
      value: topCount > 0 ? `${topSport}` : 'None',
      subtext: topCount > 0 ? `${topCount} active participants` : 'No sports registered',
      icon: Trophy,
      color: 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-950/50',
      bgGradient: 'from-white via-white/95 to-amber-50/40 border-amber-100 hover:border-amber-200/80 shadow-amber-100/20',
    },
    {
      id: 'elite-students',
      label: 'Highest Performers',
      value: elitePerformers,
      subtext: 'Score of 98%+ in subjects',
      icon: Sparkles,
      color: 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-950/20 dark:border-purple-950/50',
      bgGradient: 'from-white via-white/95 to-purple-50/40 border-purple-100 hover:border-purple-200/80 shadow-purple-100/20',
    },
    {
      id: 'passing-rate',
      label: 'Passing Rate',
      value: `${passingRate}%`,
      subtext: 'Zero failing subjects',
      icon: ShieldCheck,
      color: 'bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-950/20 dark:border-sky-950/50',
      bgGradient: 'from-white via-white/95 to-sky-50/40 border-sky-100 hover:border-sky-200/80 shadow-sky-100/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.id}
            id={stat.id}
            className={`bg-gradient-to-br ${stat.bgGradient} border rounded-2xl p-5 shadow-3xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl border ${stat.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-black tracking-tight text-slate-800 mb-1">
                {stat.value}
              </h4>
              <p className="text-slate-400 text-xs truncate font-medium">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
