import CourseTime from './CourseTime';

class Course {
  term: string;
  acadCareer: string;
  courseCode: string;
  classSection: string;
  times: CourseTime[];
  courseTitle: string;
  offerDept: string;
  instructor: string;

  constructor(
    term: string, acadCareer: string, courseCode: string, classSection: string,
    times: CourseTime[], courseTitle: string, offerDept: string, instructor: string,
  ) {
    this.term = term;
    this.acadCareer = acadCareer;
    this.courseCode = courseCode;
    this.classSection = classSection;
    this.times = times;
    this.courseTitle = courseTitle;
    this.offerDept = offerDept;
    this.instructor = instructor;
  }

  static fromData(data: any): Course {
    return new Course(
      data['TERM'],
      data['ACAD_CAREER'],
      data['COURSE CODE'],
      data['CLASS SECTION'],
      [CourseTime.fromData(data)],
      data['COURSE TITLE'],
      data['OFFER DEPT'],
      data['INSTRUCTOR'],
    );
  }

  addedTime(time: CourseTime): Course {
    return new Course(
      this.term,
      this.acadCareer,
      this.courseCode,
      this.classSection,
      this.times.concat(time),
      this.courseTitle,
      this.offerDept,
      this.instructor,
    );
  }
}

export default Course;