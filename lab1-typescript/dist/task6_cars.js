"use strict";
// ==== Завдання 6: cars.ts ====
// Абстрактний клас - не можна створити "просто Car", можна лише конкретну марку
class Car {
    constructor(brand, model, vin) {
        this.brand = brand;
        this.model = model;
        this.vin = vin;
    }
    getVin() {
        return this.vin;
    }
}
class Toyota extends Car {
    constructor(model, vin, color) {
        super("Toyota", model, vin); // виклик конструктора батьківського класу
        this.color = color;
    }
    describe() {
        console.log(`${this.brand} ${this.model}, колір: ${this.color}, VIN: ${this.getVin()}`);
    }
}
class BMW extends Car {
    constructor(model, vin, enginePower) {
        super("BMW", model, vin);
        this.enginePower = enginePower;
    }
    describe() {
        console.log(`${this.brand} ${this.model}, потужність: ${this.enginePower} к.с., VIN: ${this.getVin()}`);
    }
}
class Audi extends Car {
    constructor(model, vin, year) {
        super("Audi", model, vin);
        this.year = year;
    }
    describe() {
        console.log(`${this.brand} ${this.model}, рік випуску: ${this.year}, VIN: ${this.getVin()}`);
    }
}
// мінімум по 2 екземпляри для кожної марки
const car1 = new Toyota("Corolla", "VIN001", "білий");
const car2 = new Toyota("Camry", "VIN002", "чорний");
const car3 = new BMW("X5", "VIN003", 340);
const car4 = new BMW("M3", "VIN004", 480);
const car5 = new Audi("A4", "VIN005", 2022);
const car6 = new Audi("Q7", "VIN006", 2023);
[car1, car2, car3, car4, car5, car6].forEach((car) => car.describe());
//# sourceMappingURL=task6_cars.js.map