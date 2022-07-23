import CourseTime from './CourseTime';

interface Course {
  term: string;
  acadCareer: string;
  courseCode: string;
  classSection: string;
  times: CourseTime[];
  courseTitle: string;
  offerDept: string;
  instructor: string;
}

export default Course;