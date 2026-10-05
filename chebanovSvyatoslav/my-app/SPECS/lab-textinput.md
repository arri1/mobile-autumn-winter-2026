# Lab: TextInput (контролируемое поле)

## Цель
Контролируемый `TextInput` на `useState`.

## Стек
Expo + TypeScript.

## Экран
Отдельный `NameScreen` (вкладка Name).

## UI
- `TextInput` + текст «Привет, {name}»
- Пустое имя → просто «Привет!»

## Поведение
- `value` из state
- `onChangeText` обновляет state

## Ограничения
- `useState` + `StyleSheet`
- Без форм-библиотек

## Готово, если
- [ ] Ввод сразу отражается в приветствии
- [ ] Поле controlled (`value` + `onChangeText`)

## Не делаем
- Отправка на сервер
- Валидация email
- Маски ввода