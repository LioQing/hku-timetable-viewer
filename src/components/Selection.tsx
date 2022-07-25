import Container from '@mui/material/Container';
import CourseList from './CourseList';
import Intro from './Intro';

const Selection = () => {
  return (
    <Container style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '20rem',
      minWidth: '20rem',
      margin: '10px',
      padding: '0px',
    }}>
      <CourseList />
      <Intro />
    </Container>
  );
};

export default Selection;