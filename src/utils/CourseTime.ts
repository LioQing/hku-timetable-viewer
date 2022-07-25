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

  static fromData(data: any): CourseTime {
    return new CourseTime(
      new Date(data['START DATE']),
      new Date(data['END DATE']),
      new Date(`1970-01-01 ${data['START TIME']}`),
      new Date(`1970-01-01 ${data['END TIME']}`),
      CourseTime.getDayBoolArray(data),
      data['VENUE'],
    );
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