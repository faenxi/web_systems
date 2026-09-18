"use strict";
// ==== Завдання 2 (пункт 4): functions.ts ====
// Функція приймає рядок (name) і число (age).
// Якщо age не передано - використовується значення за замовчуванням 18.
function greetUser(name, age = 18) {
    return `Привіт, ${name}! Тобі ${age} років.`;
}
console.log(greetUser("Андрій", 25)); // з явним віком
console.log(greetUser("Марія")); // вік підставиться сам = 18
//# sourceMappingURL=task2_functions.js.map