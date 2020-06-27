import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const SET_CONFIG = 'SET_CONFIG';

export default new Vuex.Store({
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
