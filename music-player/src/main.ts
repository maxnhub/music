import { createApp } from 'vue';
import App from './App.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faAngleLeft, faAngleRight, faPause } from '@fortawesome/free-solid-svg-icons';

// Добавляем иконки в библиотеку
library.add(faPlay, faAngleLeft, faAngleRight, faPause);

// Создаем Vue-приложение
const app = createApp(App);

// Глобально регистрируем компонент FontAwesome
app.component('FontAwesomeIcon', FontAwesomeIcon);

// Монтируем приложение в элемент с id="app"
app.mount('#app');

export { library };