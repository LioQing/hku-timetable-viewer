class CourseListFilters {
  showSelected: boolean;
  search: string;

  constructor(showSelected: boolean, search: string) {
    this.showSelected = showSelected;
    this.search = search;
  }
}

export default CourseListFilters;