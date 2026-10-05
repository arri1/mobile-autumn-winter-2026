# Lab: Create Post (POST)

## Цель
Экран создания поста: 2 поля → `POST /posts` → возврат к списку.

## Стек
Expo + TypeScript. API: JSONPlaceholder.

## Файлы
- `api.ts` — `createPost(payload)`
- `screens/CreatePostScreen.tsx` — UI

## UI
- `TextInput` — заголовок
- `TextInput multiline` — текст
- Кнопка «Опубликовать» (disabled при пустых полях)

## Поведение
- `value` + `onChangeText` (контролируемые поля)
- POST через `fetch`, `method: 'POST'`, `Content-Type: application/json`
- `Alert` об успехе → `navigation.goBack()`
- Пока идёт запрос — `ActivityIndicator` на кнопке

## Ограничения
- Только `useState` + `StyleSheet`
- Без форм-библиотек и валидации

## Готово, если
- [ ] Пост отправляется POST-запросом
- [ ] После успеха возвращаемся к списку
- [ ] Пустые поля → кнопка неактивна

## Не делаем
- Редактирование, удаление
- Загрузку картинок