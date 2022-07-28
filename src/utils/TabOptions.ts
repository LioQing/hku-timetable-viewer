import Course from './Course';

const replacer = (key: any, value: any) => {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
};

const reviver = (key: any, value: any) => {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

class TabOptions {
  sem: number;
  selectedHidden: Map<string, boolean[]>;

  constructor(sem: number, selectedHidden: Map<string, boolean[]>) {
    this.sem = sem;
    this.selectedHidden = selectedHidden;
  }

  static fromObject(obj: any): TabOptions {
    return new TabOptions(obj.sem, new Map(obj.selectedHidden));
  }

  static fromJson(json: any): TabOptions {
    return TabOptions.fromObject(JSON.parse(json, reviver));
  }

  toJson(): string {
    return JSON.stringify(this, replacer);
  }

  static falseHiddenAllFromSelected(selected: Map<string, Course>): Map<string, boolean[]> {
    var result = new Map<string, boolean[]>();
    for (const [key, course] of selected) {
      result.set(key, course.times.map(() => false));
    }
    return result;
  }
}

export default TabOptions;