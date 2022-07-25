class CourseListFilters {
  sem: number;
  showSelected: boolean;
  search: string;

  constructor(sem: number, showSelected: boolean, search: string) {
    this.sem = sem;
    this.showSelected = showSelected;
    this.search = search;
  }
}

export default CourseListFilters;