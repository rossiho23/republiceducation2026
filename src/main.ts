/**
 * @file main.ts
 * @description 應用程式入口檔案，配置 Vue 3 實例與 Pinia 狀態管理
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
