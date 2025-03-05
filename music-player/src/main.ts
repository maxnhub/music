import { createApp } from 'vue';
import App from './App.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';

// Создаем Vue-приложение
const app = createApp(App);

// Глобально регистрируем компонент FontAwesome
app.component('FontAwesomeIcon', FontAwesomeIcon);

app.use(createPinia());

// Монтируем приложение в элемент с id="app"
app.mount('#app');