"use strict";
// ==== Завдання 9: library.ts ====
class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isBorrowed = false;
    }
    borrow() {
        this.isBorrowed = true;
        console.log(`Книгу "${this.title}" позичено.`);
    }
}
class Magazine {
    constructor(title, author, issueNumber) {
        this.title = title;
        this.author = author;
        this.issueNumber = issueNumber;
        this.isBorrowed = false;
    }
    borrow() {
        this.isBorrowed = true;
        console.log(`Журнал "${this.title}" (випуск ${this.issueNumber}) позичено.`);
    }
}
class DVD {
    constructor(title, author, durationMinutes) {
        this.title = title;
        this.author = author;
        this.durationMinutes = durationMinutes;
        this.isBorrowed = false;
    }
    borrow() {
        this.isBorrowed = true;
        console.log(`DVD "${this.title}" (${this.durationMinutes} хв) позичено.`);
    }
}
class Library {
    constructor() {
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
    findItemByName(name) {
        return this.items.find((item) => item.title === name);
    }
    listItems() {
        console.log("Доступні елементи бібліотеки:");
        this.items.forEach((item) => console.log(`- ${item.title} (автор: ${item.author})`));
    }
}
// ---- Демонстрація роботи ----
const library = new Library();
library.addItem(new Book("Кобзар", "Тарас Шевченко", 320));
library.addItem(new Magazine("National Geographic", "Редакція NG", 45));
library.addItem(new DVD("Тіні забутих предків", "Сергій Параджанов", 97));
library.listItems();
const found = library.findItemByName("Кобзар");
if (found) {
    found.borrow();
}
//# sourceMappingURL=task9_library.js.map