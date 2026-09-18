"use strict";
// ==== Завдання 4: animals.ts ====
class Cat {
    constructor(name, legs = 4) {
        this.name = name;
        this.legs = legs;
    }
    move() {
        console.log(`${this.name} (кіт) крадеться на ${this.legs} лапах.`);
    }
}
class Bird {
    constructor(name, legs = 2) {
        this.name = name;
        this.legs = legs;
    }
    move() {
        console.log(`${this.name} (птах) летить у небі.`);
    }
}
class Fish {
    // у риби властивість legs не потрібна взагалі — тому в інтерфейсі вона опціональна
    constructor(name) {
        this.name = name;
    }
    move() {
        console.log(`${this.name} (риба) пливе у воді.`);
    }
}
const animals = [
    new Cat("Мурчик"),
    new Bird("Кеша"),
    new Fish("Немо"),
];
animals.forEach((animal) => animal.move());
//# sourceMappingURL=task4_animals.js.map