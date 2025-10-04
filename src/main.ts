import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/global.css';
import { createPinia } from 'pinia';
import { smoothLoop } from './directives/smoothLoop';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.directive('smooth-loop', smoothLoop);
app.mount('#app');


