
interface Payable {
  pay(): void;
}

abstract class Employee {
  constructor(
    protected name: string,
    protected age: number,
    protected salary: number
  ) {}

  abstract getAnnualBonus(): number;
}

class Developer extends Employee implements Payable {
  getAnnualBonus(): number {
    return this.salary * 0.1;
  }

  pay(): void {
    console.log(`Виплата розробнику ${this.name}: ${this.salary} грн`);
  }
}

class Manager extends Employee implements Payable {
  getAnnualBonus(): number {
    return this.salary * 0.2; 
  }

  pay(): void {
    console.log(`Виплата менеджеру ${this.name}: ${this.salary} грн`);
  }
}

const employees: Employee[] = [
  new Developer("Іван", 28, 30000),
  new Developer("Олена", 25, 28000),
  new Manager("Сергій", 35, 40000),
];

let totalBonus = 0;
for (const emp of employees) {
  totalBonus += emp.getAnnualBonus();
}

console.log(`Загальна річна сума бонусів: ${totalBonus} грн`);
