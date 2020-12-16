const SET_DATA = 'SET_DATA';

const state = {};

const mutations = {
  [SET_DATA](state, { key, data }) { // eslint-disable-line
    // set(state, key, data);
    state[key] = data;
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
