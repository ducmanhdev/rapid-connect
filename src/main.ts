import {createApp, markRaw} from 'vue';
import {createPinia} from 'pinia';
import Antd from 'ant-design-vue';
import {vMaska} from 'maska';

// @ts-ignore
import VueSignaturePad from 'vue-signature-pad';

import '@/styles/tailwind.scss';
import 'ant-design-vue/dist/antd.less';
import '@/styles/index.scss';

import App from './App.vue';
import router from './router';

const app = createApp(App);

const pinia = createPinia();
pinia.use(({store}) => {
  store.router = markRaw(router);
});
app.use(createPinia());
app.use(router);
app.use(pinia);
app.use(Antd);
app.use(VueSignaturePad);
app.directive('maska', vMaska);

app.mount('#app');
