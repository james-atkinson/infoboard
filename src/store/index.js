import Vue from 'vue';
import Vuex from 'vuex';
import * as themeComponents from '../themes/themeComponents';

Vue.use(Vuex);

const SET_CONFIG = 'SET_CONFIG';
const SET_DATA = 'SET_DATA';

const storeModules = {};

for (const [key, value] of Object.entries(themeComponents)) { // eslint-disable-line
  storeModules[key] = value.store;
}

export default new Vuex.Store({
  modules: storeModules,
  state: {
    config: {},
    data: {},
  },
  mutations: {
    [SET_CONFIG](state, { config }) {
      state.config = config;
    },
    [SET_DATA](state, { key, data }) { // eslint-disable-line
      Vue.set(state.data, key, data);
    },
  },
  actions: {
    setConfig({ commit }, { config }) {
      commit({
        type: SET_CONFIG,
        config,
      });
    },
    setData({ commit }, { key, data }) {
      commit({
        type: SET_DATA,
        key,
        data,
      });
    },
  },
});
