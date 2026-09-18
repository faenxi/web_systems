
function greetUser(name: string, age: number = 18): string {
  return `Привіт, ${name}! Тобі ${age} років.`;
}

console.log(greetUser("Андрій", 25));
console.log(greetUser("Марія"));
