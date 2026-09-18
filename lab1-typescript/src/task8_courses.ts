// ==== Завдання 8: courses.ts ====

interface Course {
  title: string;
  durationHours: number;
  students: string[];
}

class OnlineCourse implements Course {
  title: string;
  durationHours: number;
  students: string[] = [];

  constructor(title: string, durationHours: number) {
    this.title = title;
    this.durationHours = durationHours;
  }

  registerStudent(student: string): void {
    if (!this.isStudentRegistered(student)) {
      this.students.push(student);
    }
  }

  isStudentRegistered(student: string): boolean {
    return this.students.includes(student);
  }
}

class CourseManager {
  private courses: Course[] = [];

  addCourse(course: Course): void {
    this.courses.push(course);
  }

  removeCourse(courseName: string): void {
    this.courses = this.courses.filter((c) => c.title !== courseName);
  }

  findCourse(courseName: string): Course | undefined {
    return this.courses.find((c) => c.title === courseName);
  }

  listCourses(): void {
    for (const course of this.courses) {
      console.log(
        `Курс: ${course.title} (${course.durationHours} год) — студенти: ${
          course.students.length ? course.students.join(", ") : "немає"
        }`
      );
    }
  }
}

// ---- Демонстрація роботи ----
const manager = new CourseManager();

const tsCourse = new OnlineCourse("TypeScript Basics", 20);
const jsCourse = new OnlineCourse("JavaScript Advanced", 30);

manager.addCourse(tsCourse);
manager.addCourse(jsCourse);

tsCourse.registerStudent("Оксана");
tsCourse.registerStudent("Ігор");
jsCourse.registerStudent("Марія");

manager.listCourses();
