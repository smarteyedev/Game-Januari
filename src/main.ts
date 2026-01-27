import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
export const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
