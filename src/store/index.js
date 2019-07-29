import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import router from './modules/router';
import leftmenu from './modules/leftmenu';
import user from './modules/user'
import global from './modules/global';
import xm from './modules/xm';
import getters from './getters'

export default new Vuex.Store({
    modules: {
        global,
        leftmenu,
        router,
        xm,
        user
    },
    getters
});