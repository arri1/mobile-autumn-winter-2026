# Пара 3 · Controlled TextInput

```text
Цель: controlled TextInput на useState.

Стек: Expo + TypeScript.
Экран: отдельный NameScreen (вкладка «Имя»).
UI: TextInput + текст «Привет, {name}!» (пустое имя → просто «Привет!»).
Поведение: value из state; onChangeText обновляет state.
Ограничения: useState + StyleSheet; без форм-библиотек. KeyboardAvoidingView на iOS.
Готово, если: ввод сразу отражается в приветствии; поле controlled.
Не делаем: отправка на сервер, валидация email, маски ввода.
```

## Как устроено

- `value={name}` + `onChangeText={setName}` — источник правды state, а не само поле.
- Приветствие строится из `name.trim()`, поэтому пробелы не дают «Привет, !».
- Плюс: `maxLength={40}` и счётчик символов под полем — тоже читается из того же state.

Файл: `src/screens/NameScreen.tsx`.
