import teacher1 from '../assets/images/teachers/teacher_1.jpg';
import teacher2 from '../assets/images/teachers/teacher_2.jpg';
import teacher3 from '../assets/images/teachers/teacher_3.jpg';
import teacher4 from '../assets/images/teachers/teacher_4.jpg';
import teacher5 from '../assets/images/teachers/teacher_5.jpg';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  image: string;
  email: string;
  experience: string;
  bio: string;
}

export const TEACHERS_DATA: Teacher[] = [
  {
    id: 't1',
    name: 'Prof. Rajesh Sharma',
    subject: 'Mathematics',
    image: teacher1,
    email: 'r.sharma@stgeorge.edu',
    experience: '12 Years Exp.',
    bio: 'Deeply passionate about making calculus and pure algebra intuitive for secondary school scholars.'
  },
  {
    id: 't2',
    name: 'Dr. Anjali Desai',
    subject: 'General Science',
    image: teacher2,
    email: 'a.desai@stgeorge.edu',
    experience: '8 Years Exp.',
    bio: 'Specialist in microscopic studies and chemistry lab experiments. Believes in inquiry-based academic growth.'
  },
  {
    id: 't3',
    name: 'Mr. Vikram Malhotra',
    subject: 'English',
    image: teacher3,
    email: 'v.malhotra@stgeorge.edu',
    experience: '15 Years Exp.',
    bio: 'Dedicated bibliophile. Enthusiastic about Shakespearean literature, creative essays, and voice debates.'
  },
  {
    id: 't4',
    name: 'Mrs. Priya Patel',
    subject: 'Fine Arts',
    image: teacher4,
    email: 'p.patel@stgeorge.edu',
    experience: '10 Years Exp.',
    bio: 'Exhibitionist artist and historian. Encourages student creativity and expressions through mixed mediums.'
  },
  {
    id: 't5',
    name: 'Coach Amit Singh',
    subject: 'Physical Education',
    image: teacher5,
    email: 'a.singh@stgeorge.edu',
    experience: '6 Years Exp.',
    bio: 'State athletics coach. Focuses on physical stamina, strategic agility, and proactive mental teamwork.'
  }
];
