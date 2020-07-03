import Vue from 'vue';

const SET_DATA = 'SET_DATA';

const state = {};

const mutations = {
  [SET_DATA](state, { key, data }) { // eslint-disable-line
    Vue.set(state, key, data);
  },
};

const actions = {
  setData({ commit }, { key, data }) {
    commit({
      type: SET_DATA,
      key,
      data,
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
