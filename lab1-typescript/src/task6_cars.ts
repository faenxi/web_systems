
abstract class Car {
  protected brand: string; 
  public model: string;
  private vin: string;

  constructor(brand: string, model: string, vin: string) {
    this.brand = brand;
    this.model = model;
    this.vin = vin;
  }

  protected getVin(): string {
    return this.vin;
  }

  abstract describe(): void;
}

class Toyota extends Car {
  constructor(model: string, vin: string, public color: string) {
    super("Toyota", model, vin); 
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

const car1 = new Toyota("Corolla", "VIN001", "білий");
const car2 = new Toyota("Camry", "VIN002", "чорний");
const car3 = new BMW("X5", "VIN003", 340);
const car4 = new BMW("M3", "VIN004", 480);
const car5 = new Audi("A4", "VIN005", 2022);
const car6 = new Audi("Q7", "VIN006", 2023);

[car1, car2, car3, car4, car5, car6].forEach((car) => car.describe());
