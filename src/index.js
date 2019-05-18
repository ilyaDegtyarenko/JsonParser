import Vue from 'vue';
import 'babel-polyfill';
import './plugins/vuetify';
import i18n from './plugins/i18n';
import store from './store/main';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue();

new Vue({
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
