
interface LibraryItem {
  title: string;
  author: string;
  borrow(): void;
}

class Book implements LibraryItem {
  private isBorrowed = false;

  constructor(
    public title: string,
    public author: string,
    public pages: number
  ) {}

  borrow(): void {
    this.isBorrowed = true;
    console.log(`Книгу "${this.title}" позичено.`);
  }
}

class Magazine implements LibraryItem {
  private isBorrowed = false;

  constructor(
    public title: string,
    public author: string,
    public issueNumber: number
  ) {}

  borrow(): void {
    this.isBorrowed = true;
    console.log(`Журнал "${this.title}" (випуск ${this.issueNumber}) позичено.`);
  }
}

class DVD implements LibraryItem {
  private isBorrowed = false;

  constructor(
    public title: string,
    public author: string,
    public durationMinutes: number
  ) {}

  borrow(): void {
    this.isBorrowed = true;
    console.log(`DVD "${this.title}" (${this.durationMinutes} хв) позичено.`);
  }
}

class Library {
  private items: LibraryItem[] = [];

  addItem(item: LibraryItem): void {
    this.items.push(item);
  }

  findItemByName(name: string): LibraryItem | undefined {
    return this.items.find((item) => item.title === name);
  }

  listItems(): void {
    console.log("Доступні елементи бібліотеки:");
    this.items.forEach((item) =>
      console.log(`- ${item.title} (автор: ${item.author})`)
    );
  }
}

const library = new Library();

library.addItem(new Book("Кобзар", "Тарас Шевченко", 320));
library.addItem(new Magazine("National Geographic", "Редакція NG", 45));
library.addItem(new DVD("Тіні забутих предків", "Сергій Параджанов", 97));

library.listItems();

const found = library.findItemByName("Кобзар");
if (found) {
  found.borrow();
}
