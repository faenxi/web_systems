// ==== Завдання 3: icecream.ts ====
// Для введення даних через prompt у Node.js використовуємо пакет prompt-sync
// (встановлюється: npm install prompt-sync @types/prompt-sync)
import promptSyncFactory from "prompt-sync";
const prompt = promptSyncFactory();

// Власні типи-обмеження (union types) — так ми не дамо ввести щось зайве
type Size = "маленький" | "великий";
type Topping = "шоколад" | "карамель" | "ягоди";

// Ціни зберігаємо у типізованих об'єктах (Record<Ключ, Значення>)
const sizePrices: Record<Size, number> = {
  "маленький": 10,
  "великий": 25,
};

const toppingPrices: Record<Topping, number> = {
  "шоколад": 5,
  "карамель": 6,
  "ягоди": 10,
};

const MARSHMALLOW_PRICE = 5;

// Головна функція розрахунку вартості
function calculateIceCreamPrice(
  size: Size,
  toppings: Topping[],
  withMarshmallow: boolean = false
): number {
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
const sizeInput = prompt("Оберіть розмір (маленький/великий): ").trim() as Size;

const toppingsInput = prompt(
  "Введіть начинки через кому (шоколад, карамель, ягоди): "
);
const toppings: Topping[] = toppingsInput
  .split(",")
  .map((t) => t.trim()) as Topping[];

const marshmallowInput = prompt("Додати маршмелоу? (так/ні): ").trim().toLowerCase();
const withMarshmallow = marshmallowInput === "так";

const price = calculateIceCreamPrice(sizeInput, toppings, withMarshmallow);
console.log(`Вартість морозива: ${price} грн`);
