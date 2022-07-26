import { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import Prompt from './Prompt';
import { TimetableContext } from '../context/TimetableContext';

const deleted = (map: Map<string, any>, key: string): Map<string, any> => {
  var newMap = map;
  newMap.delete(key);
  return newMap;
};

interface Props {
  changeName: string | null;
  setChangeName: (changeName: string | null) => void;
}

const ChangeTabName = ({ changeName, setChangeName }: Props) => {
  const { timetable, setTimetable } = useContext(TimetableContext);
  const [ newName, setNewName ] = useState<string>(changeName as string);

  useEffect(() => {
    if (changeName !== null) {
      setNewName(changeName as string);
    }
  }, [changeName]);

  const confirmName = () => {
    const name = newName.trim();

    if (changeName === name) {
      setChangeName(null);
      return;
    }

    if (timetable.selected.has(name)) {
      alert('Tab name must be unique.');
      return;
    }

    if (name === '') {
      alert('Tab name must not be empty or whitespace only');
      return;
    }

    const selected = timetable.selected.get(changeName as string);
    const opt = timetable.tabOptions.get(changeName as string);

    setTimetable({
      ...timetable,
      selected: deleted(timetable.selected, changeName as string).set(name, selected),
      tabOptions: deleted(timetable.tabOptions, changeName as string).set(name, opt),
      currTab: changeName === timetable.currTab ? name : timetable.currTab,
    });

    setChangeName(null);

    return;
  };

  return (
    <Prompt
      title='Change Tab Name'
      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
      open={changeName !== null}
      onClose={() => setChangeName(null)}>
      <TextField
        variant='outlined'
        label='Tab Name'
        value={newName}
        onChange={event => setNewName(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') confirmName();
        }}
      />
      <IconButton
        onClick={confirmName}
        style={{ marginLeft: '4px' }}>
        <CheckIcon />
      </IconButton>
    </Prompt>
  );
};

export default ChangeTabName;