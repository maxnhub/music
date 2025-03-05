import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faAngleLeft, faAngleRight, faPause } from '@fortawesome/free-solid-svg-icons';

// Добавляем иконки в библиотеку
library.add(faPlay, faAngleLeft, faAngleRight, faPause);

// Экспортируем библиотеку, если она нужна в других частях приложения
export { library };