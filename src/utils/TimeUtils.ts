const getStartTimeFromIndex = (index: number): Date => {
  return addHours(
    new Date('01/01/1970 08:30'),
    index / 2,
  );
};

const getEndTimeFromIndex = (index: number): Date => {
  return addHours(
    new Date('01/01/1970 08:50'),
    index / 2,
  );
};

const getIndexFromStartTime = (startTime: Date): number => {
  const firstTime = new Date('01/01/1970 08:30');
  return Math.floor(
    (
      startTime.getHours() * 60 + startTime.getMinutes() -
      firstTime.getHours() * 60 - firstTime.getMinutes()
    ) / 30);
};

const getIndexFromEndTime = (startTime: Date): number => {
  const firstTime = new Date('01/01/1970 08:50');
  return Math.floor(
    (
      startTime.getHours() * 60 + startTime.getMinutes() -
      firstTime.getHours() * 60 - firstTime.getMinutes()
    ) / 30);
};

const addHours = (date: Date, h: number) => {
  date.setTime(date.getTime() + (h * 60 * 60 * 1000));
  return date;
};

const getHourString = (date: Date): string => {
  return date.toLocaleTimeString('en-GB', {
    hour12: false, 
    hour: 'numeric', 
    minute: 'numeric',
  });
};

const getHourRangeStringFromIndex = (i: number): string => {
  return `${getHourString(getStartTimeFromIndex(i))} - ${getHourString(getEndTimeFromIndex(i))}`;
};

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export {
  getStartTimeFromIndex,
  getEndTimeFromIndex,
  getIndexFromStartTime,
  getIndexFromEndTime,
  getHourString,
  getHourRangeStringFromIndex,
  dayNames,
};