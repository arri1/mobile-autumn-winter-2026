# Lab: useEffect

Цель: экран с side effect на useEffect + useState.

Стек: Expo + TypeScript. Экран TimerScreen на вкладке Timer.

Вариант: таймер — секунды с момента открытия экрана (mount), cleanup через clearInterval.

UI: подпись «Секунд на экране» и тикающее число по центру.

Ограничения: useEffect + useState + StyleSheet; без реального fetch/API.

Готово, если: эффект с [] запускается один раз; есть cleanup; код объясним.

Зачем cleanup: без clearInterval интервал продолжит тикать после ухода с экрана
(утечка и setState на размонтированном компоненте).

Не делаем: cloud.kit-imi, Redux. Настоящий fetch — в лабе просмотра постов.
