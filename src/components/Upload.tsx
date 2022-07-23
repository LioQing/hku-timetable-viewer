import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as XLSX from 'xlsx';
import Course from '../utils/Course';
import CourseTime from '../utils/CourseTime';

interface Props {
  setTimetable: (timetable: Map<string, Course>) => void;
  setSelected: (selected: string[]) => void;
  setHovered: (hovered: string | null) => void;
}

const getWeekdays = (days: any): boolean[] => {
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const result: boolean[] = [];
  for (const day of weekdays) {
    result.push(day in days);
  }

  return result;
}

const Upload = ({ setTimetable, setSelected, setHovered }: Props) => {
  const onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      // xlsx to json
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      
      // json to courses
      var timetable: Map<string, Course> = new Map();
      for (const row of json) {
        const data = row as any;

        const key: string = `${data['COURSE CODE']}-${data['CLASS SECTION']}`;
        const time: CourseTime = {
          startDate: new Date(data['START DATE']),
          endDate: new Date(data['END DATE']),
          startTime: new Date(`1970-01-01 ${data['START TIME']}`),
          endTime: new Date(`1970-01-01 ${data['END TIME']}`),
          weekday: getWeekdays(data),
          venue: data['VENUE'],
        };

        if (timetable.has(key)) {
          const course = timetable.get(key);
          course?.times.push(time);
        } else {
          const course: Course = {
            term: data['TERM'],
            acadCareer: data['ACAD_CAREER'],
            courseCode: data['COURSE CODE'],
            classSection: data['CLASS SECTION'],
            times: [time],
            courseTitle: data['COURSE TITLE'],
            offerDept: data['OFFER DEPT'],
            instructor: data['INSTRUCTOR'],
          };

          timetable.set(key, course);
        }
      }

      // set states
      setTimetable(timetable);
      setSelected([]);
      setHovered(null);
    };
  }; 

  return (
    <Button
      variant='contained'
      component='label'
      style={{ margin: '8px' }}>
      <Typography variant='caption'>
        Upload Timetable XLSX File
      </Typography>
      <input
        type='file'
        accept='.xlsx'
        onChange={onFileChanged}
        onClick={(event) => { 
          ((event.target as HTMLInputElement).value as any) = null;
        }}
        hidden
      />
    </Button>
  );
};

export default Upload;