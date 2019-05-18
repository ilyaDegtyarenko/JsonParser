import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import PROCESS from './modules/process';

const store = new Vuex.Store({
    modules: {
        PROCESS
    }
});

export default store;
