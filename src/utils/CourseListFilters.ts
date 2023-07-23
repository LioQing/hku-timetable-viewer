enum SearchBy {
  Code = "code",
  Title = "title"
}

class CourseListFilters {
  showSelected: boolean;
  search: string;
  searchBy: SearchBy;

  constructor(showSelected: boolean, search: string, searchBy: SearchBy) {
    this.showSelected = showSelected;
    this.search = search;
    this.searchBy = searchBy;
  }
}

export default CourseListFilters;
export { SearchBy };