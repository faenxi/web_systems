// ==== Завдання 6: cars.ts ====

// Абстрактний клас - не можна створити "просто Car", можна лише конкретну марку
abstract class Car {
  protected brand: string;   // protected: бачать тільки цей клас і його нащадки
  public model: string;      // public: доступно ззовні (за замовчуванням і так public)
  private vin: string;       // private: доступно лише всередині самого класу Car

  constructor(brand: string, model: string, vin: string) {
    this.brand = brand;
    this.model = model;
    this.vin = vin;
  }

  protected getVin(): string {
    return this.vin;
  }

  // абстрактний метод - кожен нащадок ЗОБОВ'ЯЗАНИЙ його реалізувати
  abstract describe(): void;
}

class Toyota extends Car {
  constructor(model: string, vin: string, public color: string) {
    super("Toyota", model, vin); // виклик конструктора батьківського класу
  }

  describe(): void {
    console.log(
      `${this.brand} ${this.model}, колір: ${this.color}, VIN: ${this.getVin()}`
    );
  }
}

class BMW extends Car {
  constructor(model: string, vin: string, private enginePower: number) {
    super("BMW", model, vin);
  }

  describe(): void {
    console.log(
      `${this.brand} ${this.model}, потужність: ${this.enginePower} к.с., VIN: ${this.getVin()}`
    );
  }
}

class Audi extends Car {
  constructor(model: string, vin: string, public year: number) {
    super("Audi", model, vin);
  }

  describe(): void {
    console.log(
      `${this.brand} ${this.model}, рік випуску: ${this.year}, VIN: ${this.getVin()}`
    );
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
