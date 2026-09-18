"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ==== Завдання 3: icecream.ts ====
// Для введення даних через prompt у Node.js використовуємо пакет prompt-sync
// (встановлюється: npm install prompt-sync @types/prompt-sync)
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
// Ціни зберігаємо у типізованих об'єктах (Record<Ключ, Значення>)
const sizePrices = {
    "маленький": 10,
    "великий": 25,
};
const toppingPrices = {
    "шоколад": 5,
    "карамель": 6,
    "ягоди": 10,
};
const MARSHMALLOW_PRICE = 5;
// Головна функція розрахунку вартості
function calculateIceCreamPrice(size, toppings, withMarshmallow = false) {
    let total = sizePrices[size];
    for (const topping of toppings) {
        total += toppingPrices[topping];
    }
    if (withMarshmallow) {
        total += MARSHMALLOW_PRICE;
    }
    return total;
}
// ---- Введення даних користувачем ----
const sizeInput = prompt("Оберіть розмір (маленький/великий): ").trim();
const toppingsInput = prompt("Введіть начинки через кому (шоколад, карамель, ягоди): ");
const toppings = toppingsInput
    .split(",")
    .map((t) => t.trim());
const marshmallowInput = prompt("Додати маршмелоу? (так/ні): ").trim().toLowerCase();
const withMarshmallow = marshmallowInput === "так";
const price = calculateIceCreamPrice(sizeInput, toppings, withMarshmallow);
console.log(`Вартість морозива: ${price} грн`);
//# sourceMappingURL=task3_icecream.js.map