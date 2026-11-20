# vue-lottery-app

Лабораторна робота №4: лотерея на Vue 3 (Composition API) + TypeScript + Bootstrap (SCSS) + ESLint.

## Запуск

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Структура

- `src/components/base/` — `BaseButton`, `BaseInput`, `BaseModal` (багаторазові компоненти)
- `src/components/` — `WinnerItem`, `WinnersBlock`, `RegistrationBlock`, `ParticipantForm`, `ParticipantsBlock`, `SearchBar`
- `src/composables/` — `useParticipants` (дані + localStorage через `watch` з `deep`), `useWinners` (логіка переможців)
- `src/utils/` — валідація (regexp) та форматування дати

## Контрольні запитання

1. **Computed** — реактивне значення, обчислене з інших даних. На відміну від методу, результат кешується.
2. Значення перераховується лише тоді, коли змінилась реактивна залежність; інакше повертається кеш.
3. За замовчуванням ні (лише читання). Writable: `computed({ get() {...}, set(v) {...} })`.
4. Inline: `@click="count++"`; метод: `@click="handler"`. Inline — для коротких виразів, метод — для складної логіки (отримує `event`).
5. `.prevent` — `preventDefault`, `.stop` — зупиняє спливання, `.once` — спрацює один раз. `.enter`/`.esc` — реакція лише на клавішу: `@keydown.enter="submit"`, `@keydown.esc="close"`.
6. `v-model` для тексту = `:value="text"` + `@input="text = $event.target.value"`.
7. checkbox — `true/false` або масив; radio — значення вибраної кнопки; select — `v-model` на `<select>`; textarea — як звичайний input.
8. `.lazy` — оновлення по `change`, а не `input`; `.number` — приведення до числа; `.trim` — обрізання пробілів.
9. Функції-валідатори (обов'язкове поле, regexp для e-mail і телефону, дата не в майбутньому), помилки в `errors` і виводяться під полем (`is-invalid` + `invalid-feedback`), а не через `alert`.
10. Валідація запускається подіями (`blur`, `input`, `submit`), а не `watch`. Під час очищення просто скидаємо значення, `errors` і `touched`, тож перевірка не спрацьовує.
11. Props — дані, які батько передає дочірньому компоненту. Напрямок: зверху вниз.
12. Props лише для читання (односпрямований потік даних). Потрібна зміна — зробити локальну копію (`ref`/`computed`) або повідомити батька через `emit`.
13. `defineProps<{ title: string; size?: number }>()`; необов'язковий — з `?`; значення за замовчуванням — деструктуризація `{ size = 10 }` або `withDefaults`.
14. Через `emit`: `defineEmits<{ save: [id: string] }>()` і `emit('save', id)`.
15. `const model = defineModel<string>()`; використання: `<MyInput v-model="text" />` (під капотом prop `modelValue` + подія `update:modelValue`).
16. Слот — місце в компоненті, куди батько вставляє свою розмітку. Іменований слот (`#header`, `#footer`) має ім'я, а слот за замовчуванням один. У `BaseModal` це `header`, основний вміст і `footer`.
17. Watch — спостерігає за даними й виконує побічний ефект (збереження, запит). Computed — повертає похідне значення для шаблону. Обчислюєш значення — `computed`, робиш дію — `watch`.
18. `deep` — стежити за вкладеними змінами; `immediate` — запустити одразу. `watchEffect` сам визначає залежності й запускається одразу, а `watch` стежить за явно вказаним джерелом.
19. `watch(participants, v => localStorage.setItem(KEY, JSON.stringify(v)), { deep: true })`, а при старті `ref(JSON.parse(localStorage.getItem(KEY)))`.
20. Один компонент — одна відповідальність, дані йдуть вниз через props, події вгору через emit, повторюваний UI виносимо окремо. Reusable-компонент можна використовувати в різних місцях з різними даними (наприклад, `BaseButton`, `BaseModal`).
21. `computed`: спочатку `filter` за іменем, потім `sort` копії масиву; вихідний масив не змінюється.
22. Options API — код розбитий за опціями (`data`, `methods`, `computed`), простіший для старту. Composition API — код групується за логікою, легко виносити в composables, краще працює з TypeScript.
