"use strict";
// ==== Завдання 7: employees.ts ====
class Employee {
    constructor(name, age, salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }
}
class Developer extends Employee {
    getAnnualBonus() {
        return this.salary * 0.1; // 10% від зарплати
    }
    pay() {
        console.log(`Виплата розробнику ${this.name}: ${this.salary} грн`);
    }
}
class Manager extends Employee {
    getAnnualBonus() {
        return this.salary * 0.2; // 20% від зарплати
    }
    pay() {
        console.log(`Виплата менеджеру ${this.name}: ${this.salary} грн`);
    }
}
const employees = [
    new Developer("Іван", 28, 30000),
    new Developer("Олена", 25, 28000),
    new Manager("Сергій", 35, 40000),
];
let totalBonus = 0;
for (const emp of employees) {
    totalBonus += emp.getAnnualBonus();
}
console.log(`Загальна річна сума бонусів: ${totalBonus} грн`);
//# sourceMappingURL=task7_employees.js.map