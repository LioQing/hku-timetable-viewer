import { useContext, useMemo, useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Panel from './Panel';
import ChangeTabName from './ChangeTabName';
import TabOptions from '../utils/TabOptions';
import { TimetableContext } from '../context/TimetableContext';

const deleted = (map: Map<string, any>, key: string): Map<string, any> => {
  var newMap = map;
  newMap.delete(key);
  return newMap;
};

const TabView = () => {
  const { timetable, setTimetable } = useContext(TimetableContext);
  const [ changeName, setChangeName ] = useState<string | null>(null);
  const tabNames = useMemo(() => Array.from(timetable.selected.keys()).sort(), [timetable]);

  const onAddTab = () => {
    var name = 'untitled';
    var i = 1;
    while (timetable.selected.has(name)) {
      name = `untitled ${i}`;
      i += 1;
    }

    setTimetable({
      ...timetable,
      selected: timetable.selected.set(name, []),
      tabOptions: timetable.tabOptions.set(name, new TabOptions(1)),
      currTab: name,
    });
  };

  const onTabChange = (_: any, newCurrTab: number) => {
    setTimetable({ ...timetable, currTab: tabNames[newCurrTab] });
  };

  const onTabRemove = (key: string) => {
    if (timetable.selected.size === 1) {
      alert('You cannot have less than 1 tab');
      return;
    }

    const newSelected = deleted(timetable.selected, key);
    setTimetable({
      ...timetable,
      selected: newSelected,
      currTab: Array.from(newSelected.keys())[0],
      tabOptions: deleted(timetable.tabOptions, key),
    });
  };

  return (
    <>
      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Tabs
          value={tabNames.indexOf(timetable.currTab)}
          onChange={onTabChange}
          // see issue https://github.com/mui/material-ui/issues/31936
          // variant='scrollable'
          // allowScrollButtonsMobile
          aria-label='tab'>
          {tabNames.map(tab => {
            return (
              <Tab
                key={tab}
                component='div'
                onDoubleClick={() => setChangeName(tab)}
                style={{ padding: '4px', textTransform: 'none', minWidth: '1px' }}
                label={
                  <Panel style={{ padding: '4px' }}>
                    <Typography variant='caption' style={{ margin: '4px' }}>
                      {tab}
                    </Typography>
                    <IconButton
                      disableRipple
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        onTabRemove(tab);
                      }}
                      style={{ margin: '4px', width: '1.2rem', height: '1.2rem' }}>
                      <CloseIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                    </IconButton>
                  </Panel>
                }
              />
            );
          })}
        </Tabs>
        <Panel style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '0.8rem',
          width: '1.6rem',
          height: '1.6rem',
          margin: '8px',
          }}>
          <IconButton
            onClick={onAddTab}
            style={{ margin: '4px', width: '1.6rem', height: '1.6rem' }}>
            <AddIcon style={{ width: '1.6rem', height: '1.6rem' }} />
          </IconButton>
        </Panel>
      </Box>
      <ChangeTabName changeName={changeName} setChangeName={setChangeName} />
    </>
  );
};

export default TabView;