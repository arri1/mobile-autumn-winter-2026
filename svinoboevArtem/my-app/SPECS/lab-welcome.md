# Пара 2 · Welcome + Bottom Tabs

```text
Цель: стартовый экран приложения курса и нижние вкладки, куда складываются лабы.

Стек: Expo + TypeScript, @react-navigation/native + bottom-tabs.
Экран WelcomeScreen:
- заголовок «Добро пожаловать»
- подзаголовок: ФИО и группа
- кнопка «Начать» → переход на вкладку «Счётчик»

Tabs: Главная / Счётчик / Имя / Эффекты / Посты / О себе (иконки Ionicons).
Ограничения: View, Text, Pressable, StyleSheet; экраны в src/screens/, не в App.tsx.
Готово, если: expo start без ошибок, табы переключаются, Home = Welcome, код разложен по файлам.
Не делаем: анимации, UI-kit.
```

Файлы: `App.tsx`, `src/screens/WelcomeScreen.tsx`, `src/screens/AboutScreen.tsx`.
