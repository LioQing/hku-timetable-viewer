class TabOptions {
  sem: number;

  constructor(sem: number) {
    this.sem = sem;
  }

  toParseString(): string {
    return `${this.sem}`;
  }

  static fromObject(obj: any): TabOptions {
    const sem = obj.sem;
    return new TabOptions(sem);
  }

  static fromString(str: string): TabOptions {
    const sem = parseInt(str, 10);
    return new TabOptions(sem);
  }
}

export default TabOptions;