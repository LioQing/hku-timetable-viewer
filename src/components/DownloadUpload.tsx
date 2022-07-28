import { useState, useContext } from 'react';
import * as XLSX from 'xlsx';
import * as FileSave from 'file-saver';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import CourseTime from '../utils/CourseTime';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import HelpIcon from '@mui/icons-material/Help';
import CourseListHelp from './CourseListHelp';
import Course from '../utils/Course';
import TabOptions from '../utils/TabOptions';
import { Timetable, TimetableContext } from '../context/TimetableContext';

interface JsonInfo {
  'Tab Name': string;
  'Options': string;
  'Courses': string[];
}

const DownloadUpload = () => {
  const { timetable, setTimetable } = useContext(TimetableContext);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [workbook, setWorkbook] = useState(XLSX.utils.book_new());

  const onFileUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newTimetable: Timetable = {
      ...timetable,
      selected: new Map([['untitled', []]]),
      tabOptions: new Map([['untitled', new TabOptions(1, new Map())]]),
      currTab: 'untitled',
      hovered: null,
    };

    const file = event.target?.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      // xlsx to json
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      // json to courses
      var courses: Map<string, Course> = new Map();
      for (const row of json) {
        const data = row as any;

        const key: string = `${data['COURSE CODE']}-${data['CLASS SECTION']}`;
        const time = CourseTime.fromData(data);

        if (courses.has(key)) {
          courses.get(key)?.times.push(time);
        } else {
          courses.set(key, Course.fromData(data));
        }
      }

      // find selected course if any
      const selectedSheetIndex = wb.SheetNames.indexOf('Selected Courses');
      if (selectedSheetIndex !== -1) {
        const selectedSheet = wb.Sheets[wb.SheetNames[selectedSheetIndex]];
        const selectedAoa = XLSX.utils
          .sheet_to_csv(selectedSheet)
          .split('\n')
          .map((row) => row.split(','));

        const selectedJson: JsonInfo[] = XLSX.utils
          .sheet_to_json<any>(selectedSheet)
          .map((row): JsonInfo => {
            return {
              'Tab Name': row['Tab Name'],
              'Options': row['Options'],
              'Courses': Object.entries(row)
                .filter(([key]) => key !== 'Tab Name' && key !== 'Options')
                .map(([key, value]) => (typeof value === 'string' ? value : null)!),
              };
            });

        if (selectedAoa[0][0] !== 'Tab Name') {
          newTimetable.selected = new Map([['untitled', selectedAoa.flat()]]);
          newTimetable.currTab = 'untitled';
        } else {
          // process selected
          const newSelected: [string, string[]][] = selectedJson
            .map((json) => [json['Tab Name'], json['Courses']]);
          newTimetable.selected = new Map(newSelected);

          // process tabs
          const newTabOptions: [string, TabOptions][] = selectedJson
            .map((opt) => {
              if (['0', '1', '2'].includes(opt['Options'])) {
                return [
                  opt['Tab Name'],
                  new TabOptions(
                    parseInt(opt['Options']),
                    TabOptions.falseHiddenAllFromSelected(new Map(Array.from(newTimetable.selected.get(opt['Tab Name'])!)
                      .map((selected): [string, Course] => [selected, courses.get(selected)!])
                    ))
                  ),
                ];
              }

              return [opt['Tab Name'], TabOptions.fromJson(opt['Options'])];
            });
          newTimetable.tabOptions = new Map(newTabOptions);
          newTimetable.currTab = newSelected[0][0];
        }
      }

      setTimetable({ ...newTimetable, courses });
      setWorkbook(wb);
    };
  };

  const onFileDownload = () => {
    // update selected
    var wb = workbook;
    if (!wb.SheetNames.includes('Selected Courses')) {
      wb.SheetNames.push('Selected Courses');
    }

    wb.Sheets['Selected Courses'] = XLSX.utils.aoa_to_sheet(
      [['Tab Name', 'Options', 'Courses']].concat(Array.from(timetable.selected.keys()).map((key) => {
        return [key]
          .concat((timetable.tabOptions.get(key)!).toJson())
          .concat(timetable.selected.get(key)!);
      }))
    );

    // download
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const s2ab = (s: any) => {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    FileSave.saveAs(new Blob([s2ab(out)], { type: 'application/octet-stream' }), 'timetable.xlsx');
    setWorkbook(wb);
  };

  return (
    <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: 0 }}>
      <IconButton
        component='label'
        onClick={() => {
          ((document.getElementById('timetable-upload') as HTMLInputElement).value as any) = null;
        }}
        style={{ margin: '0.4rem 0px', padding: '0.4rem' }}>
        <UploadIcon />
        <input
          id='timetable-upload'
          type='file'
          accept='.xlsx'
          onChange={onFileUploaded}
          hidden
        />
      </IconButton>
      <IconButton
        component='label'
        onClick={onFileDownload}
        style={{ margin: '0.4rem 0px', padding: '0.4rem' }}>
        <DownloadIcon />
      </IconButton>
      <IconButton
        onClick={(_) => setHelpOpen(true)}
        style={{ margin: '0.4rem 0px', padding: '0.4rem' }}>
        <HelpIcon />
      </IconButton>
      <CourseListHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </Container>
  );
};

export default DownloadUpload;