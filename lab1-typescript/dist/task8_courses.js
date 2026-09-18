"use strict";
// ==== Завдання 8: courses.ts ====
class OnlineCourse {
    constructor(title, durationHours) {
        this.students = [];
        this.title = title;
        this.durationHours = durationHours;
    }
    registerStudent(student) {
        if (!this.isStudentRegistered(student)) {
            this.students.push(student);
        }
    }
    isStudentRegistered(student) {
        return this.students.includes(student);
    }
}
class CourseManager {
    constructor() {
        this.courses = [];
    }
    addCourse(course) {
        this.courses.push(course);
    }
    removeCourse(courseName) {
        this.courses = this.courses.filter((c) => c.title !== courseName);
    }
    findCourse(courseName) {
        return this.courses.find((c) => c.title === courseName);
    }
    listCourses() {
        for (const course of this.courses) {
            console.log(`Курс: ${course.title} (${course.durationHours} год) — студенти: ${course.students.length ? course.students.join(", ") : "немає"}`);
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
//# sourceMappingURL=task8_courses.js.map