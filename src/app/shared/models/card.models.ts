export interface EventCardData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  icon: string;
  color: string;
}

export interface CourseCardData {
  id: string;
  title: string;
  instructor: string;
  time: string;
  room: string;
  students: number;
  icon: string;
  color: string;
  dayOfWeek?: string;
}
