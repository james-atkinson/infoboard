import Vue from 'vue';
import Vuex from 'vuex';
import * as themeComponents from '../themes/themeComponents';

Vue.use(Vuex);

const SET_CONFIG = 'SET_CONFIG';

const storeModules = {};

for (const [key, value] of Object.entries(themeComponents)) { // eslint-disable-line
  storeModules[key] = value.store;
}

export default new Vuex.Store({
  modules: storeModules,
  state: {
    config: {},
  },
  mutations: {
    [SET_CONFIG](state, { config }) {
      state.config = config;
    },
  },
  actions: {
    setConfig({ commit }, { config }) {
      commit({
        type: SET_CONFIG,
        config,
      });
    },
  },
});
