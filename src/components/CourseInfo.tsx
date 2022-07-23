import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Course from '../utils/Course';

interface Props {
  open: boolean;
  course?: Course;
  onClose?: () => void;
}

const Content = ({ course }: { course: Course }) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <>
      <DialogTitle>{`${course.courseCode}-${course.classSection}`}</DialogTitle>
      <Container style={{ padding: '0px 24px 16px 24px' }}>
        <Typography variant='h4'>{course.courseTitle}</Typography>
        <Typography variant='body1'>
          Term: {course.term}
          <br />
          Career: {course.acadCareer}
          <br />
          Offer Department: {course.offerDept}
          <br />
          <br />
          Instructor: {course.instructor}
          <br />
          <br />
          {course.times.map((time, i) => {
            return (
              <Typography key={i} variant='body1'>
                {time.startDate.toLocaleDateString('en-GB')}
                {' - '}
                {time.endDate.toLocaleDateString('en-GB')}
                {'; '}
                {time.startTime.toLocaleTimeString('en-GB', { hour12: false, hour: 'numeric', minute: 'numeric' })}
                {' - '}
                {time.endTime.toLocaleTimeString('en-GB', { hour12: false, hour: 'numeric', minute: 'numeric' })}
                {'; '}
                {time.weekday
                  .map((day, index) => {
                    if (!day) {
                      return null;
                    }
                    return weekdays[index];
                  })
                  .filter(day => day !== null)
                  .join(', ')
                }
              </Typography>
            );
          })}
        </Typography>
      </Container>
    </>
  );
};

const CourseInfo = ({ open, course, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {course
        ? <Content course={course as Course} />
        : null
      }
    </Dialog>
  );
};

export default CourseInfo;