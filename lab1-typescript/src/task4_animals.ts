
interface Animal {
  name: string;
  legs?: number; 
  move(): void;
}

class Cat implements Animal {
  constructor(public name: string, public legs: number = 4) {}

  move(): void {
    console.log(`${this.name} (кіт) крадеться на ${this.legs} лапах.`);
  }
}

class Bird implements Animal {
  constructor(public name: string, public legs: number = 2) {}

  move(): void {
    console.log(`${this.name} (птах) летить у небі.`);
  }
}

class Fish implements Animal {
  constructor(public name: string) {}

  move(): void {
    console.log(`${this.name} (риба) пливе у воді.`);
  }
}

const animals: Animal[] = [
  new Cat("Мурчик"),
  new Bird("Кеша"),
  new Fish("Немо"),
];

animals.forEach((animal) => animal.move());
