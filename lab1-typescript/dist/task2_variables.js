"use strict";
// ==== Завдання 2 (пункти 1-3): variables.ts ====
// 1. Змінні різних типів
let userName = "Оксана";
let age = 21;
let isStudent = true;
let something = "тут може бути що завгодно"; // тип any — вимикає перевірку типів
console.log("Ім'я:", userName);
console.log("Вік:", age);
console.log("Чи студент:", isStudent);
console.log("Значення any:", something);
// 2. Масиви з конкретним типом елементів
let studentNames = ["Оксана", "Ігор", "Марія"];
let grades = [90, 85, 100, 77];
console.log("Масив рядків:", studentNames);
console.log("Масив чисел:", grades);
// 3. Компіляція: у терміналі виконати
//    npx tsc src/task2_variables.ts --outDir dist
//    node dist/task2_variables.js
// або просто: npm run build && node dist/task2_variables.js
//# sourceMappingURL=task2_variables.js.map