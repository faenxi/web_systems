"use strict";
// ==== Завдання 5: shapes.ts ====
class Circle {
    constructor(radius) {
        this.radius = radius;
    }
    getArea() {
        return Math.PI * this.radius ** 2;
    }
    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
    // масштабування - множимо розмір на коефіцієнт
    scale(factor) {
        this.radius *= factor;
    }
}
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
    scale(factor) {
        this.width *= factor;
        this.height *= factor;
    }
}
class Triangle {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    // формула Герона для площі трикутника за трьома сторонами
    getArea() {
        const s = (this.a + this.b + this.c) / 2;
        return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
    }
    getPerimeter() {
        return this.a + this.b + this.c;
    }
    scale(factor) {
        this.a *= factor;
        this.b *= factor;
        this.c *= factor;
    }
}
// Масив об'єктів типу Shape - завдяки інтерфейсу всі фігури можна тримати разом
const shapes = [
    new Circle(5),
    new Rectangle(4, 6),
    new Triangle(3, 4, 5),
];
let totalArea = 0;
let totalPerimeter = 0;
for (const shape of shapes) {
    totalArea += shape.getArea();
    totalPerimeter += shape.getPerimeter();
}
console.log(`Загальна площа усіх фігур: ${totalArea.toFixed(2)}`);
console.log(`Загальний периметр усіх фігур: ${totalPerimeter.toFixed(2)}`);
//# sourceMappingURL=task5_shapes.js.map