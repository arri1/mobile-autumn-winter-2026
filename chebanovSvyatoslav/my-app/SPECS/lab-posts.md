# Lab: Posts (GET)

## Цель
Экран списка постов, загрузка с API через `fetch` в `useEffect`.

## Стек
Expo + TypeScript. API: JSONPlaceholder (`https://jsonplaceholder.typicode.com`).

## Файлы
- `api.ts` — `getPosts(limit)`
- `screens/PostsScreen.tsx` — UI

## UI
- Загрузка → `ActivityIndicator`
- Ошибка → текст + кнопка «Повторить»
- Пусто → текст «Пока нет постов»
- Данные → `FlatList` карточек (title, body, id)

## Поведение
- `useEffect` с `[]` — один раз при монтировании
- `fetch` внутри async-функции `load()`
- Pull-to-refresh (`RefreshControl`) — бонус

## Ограничения
- Только `useState`, `useEffect`, `StyleSheet`
- `fetch` без axios
- Без кэша и офлайна

## Готово, если
- [ ] Посты видны на экране
- [ ] Есть состояния loading / error / empty
- [ ] Можно обновить список

## Не делаем
- Авторизацию
- Пагинацию
- Redux / Zustand