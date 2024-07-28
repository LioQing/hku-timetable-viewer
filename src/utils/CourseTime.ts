class CourseTime {
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  weekday: boolean[];
  venue: string;

  constructor(
    startDate: Date, endDate: Date, startTime: Date,
    endTime: Date, weekday: boolean[], venue: string,
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.weekday = weekday;
    this.venue = venue;
  }

  static fromObject(obj: any): CourseTime {
    return new CourseTime(
      obj.startDate,
      obj.endDate,
      obj.startTime,
      obj.endTime,
      obj.weekday,
      obj.venue,
    );
  }

  static fromData(data: any): CourseTime {
    console.log(data);
    return new CourseTime(
      CourseTime.dateFromExcel(data['START DATE']),
      CourseTime.dateFromExcel(data['END DATE']),
      CourseTime.timeFromExcel(data['START TIME']),
      CourseTime.timeFromExcel(data['END TIME']),
      CourseTime.getDayBoolArray(data),
      data['VENUE'],
    );
  }

  static dateFromExcel(data: any): Date {
    if (typeof data === 'number') {
      return new Date((data - 25569) * 86400000);
    }
    return new Date(data);
  }

  static timeFromExcel(data: any): Date {
    if (typeof data === 'number') {
      let date = new Date(1970, 1, 1);
      date.setMilliseconds(data * 86400000);
      return date;
    }
    return new Date(`1970-01-01T${data}`);
  }

  private static getDayBoolArray(days: any): boolean[] {
    const daysName = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
    const result: boolean[] = [];
    for (const day of daysName) {
      result.push(day in days);
    }
  
    return result
  }
}

export default CourseTime;