/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { fetchRandomItem, deleteItem } from '../../api/items';
import {
  PLAYER_G_FILTER_FILE_TYPES,
  PLAYER_G_FILTERS,
  PLAYER_G_OPTIONS,
  PLAYER_G_HISTORY,
  PLAYER_G_HISTORY_LENGTH,
  PLAYER_G_HISTORY_INDEX,
  PLAYER_G_HISTORY_ITEM,

  PLAYER_M_FILTERS,
  PLAYER_M_OPTIONS,
  PLAYER_M_RESET_INTERVAL,
  PLAYER_M_SET_HISTORY_INDEX,
  PLAYER_M_ADD_HISTORY_ITEM,
  PLAYER_M_DELETE_HISTORY_ITEM,
  PLAYER_M_ADD_ERROR,

  PLAYER_A_FETCH_NEXT,
  PLAYER_A_DELETE_ITEM,
} from '../types';

const INTERVAL_DEFAULT = 3; // seconds

const state = () => ({
  filterFileTypes: ['JPEG', 'GIF', 'PNG', 'WEBM', 'MP4', 'MKV'],

  filters: {
    folders: [],
    tags: [], // List of tags ids.
    fileTypes: [],
  },

  options: {
    interval: INTERVAL_DEFAULT,
    zoom: 1,
    scale: true,
    showPath: true,
    showFromPined: false,
    showTags: true,
    muteVideo: true,
  },

  history: {
    items: [],
    index: 0,
  },

  errors: [],
});

const getters = {
  [PLAYER_G_FILTER_FILE_TYPES]: (state) => state.filterFileTypes,
  [PLAYER_G_FILTERS]: (state) => state.filters,
  [PLAYER_G_OPTIONS]: (state) => state.options,
  [PLAYER_G_HISTORY]: (state) => state.history,
  [PLAYER_G_HISTORY_LENGTH]: (state) => state.history.items.length,
  [PLAYER_G_HISTORY_INDEX]: (state) => state.history.index,
  [PLAYER_G_HISTORY_ITEM]: (state) => (index) => state.history.items[index],
};

const mutations = {
  [PLAYER_M_FILTERS] (state, filters) {
    Object.keys(filters).forEach((keys) => {
      Vue.set(state.filters, keys, filters[keys]);
    });
  },

  [PLAYER_M_OPTIONS] (state, options) {
    Object.keys(options).forEach((keys) => {
      Vue.set(state.options, keys, options[keys]);
    });
  },

  [PLAYER_M_RESET_INTERVAL] (state) {
    Vue.set(state.options, 'interval', INTERVAL_DEFAULT);
  },

  [PLAYER_M_SET_HISTORY_INDEX] (state, index) {
    Vue.set(state.history, 'index', index);
  },

  [PLAYER_M_ADD_HISTORY_ITEM] (state, item) { state.history.items.push(item) },

  [PLAYER_M_DELETE_HISTORY_ITEM] (state, itemSrc) {
    Vue.set(state.history, 'index', state.history.index - 1);
    Vue.set(
      state.history,
      'items',
      state.history.items.filter((item) => item.src !== itemSrc),
    );
  },

  [PLAYER_M_ADD_ERROR] (state, { actionName, error }) {
    const e = {};
    e[actionName] = error;
    state.errors.push(e);
    // eslint-disable-next-line no-console
    console.error(`Error from "${actionName}":`, error);
  },
};

const actions = {

  // TODO: Feature: Add fetch items from bdd with tags and types.
  async [PLAYER_A_FETCH_NEXT] ({ commit, getters }) {
    let result;

    const filters = getters[PLAYER_G_FILTERS];

    try {
      // if (filters.tags.length) {
      //   result = await fetchRandomItemFromBdd({
      //     tags: filters.tags,
      //   });
      // } else {
      result = await fetchRandomItem({
        folders: filters.folders,
      });
      // }
    } catch (error) {
      commit(PLAYER_M_ADD_ERROR, { actionName: PLAYER_A_FETCH_NEXT, error });
      throw error;
    }

    return result;
  },

  async [PLAYER_A_DELETE_ITEM] ({ commit }, itemSrc) {
    let result = false;

    try {
      result = await deleteItem({ itemSrc });
    } catch (error) {
      commit(PLAYER_M_ADD_ERROR, { actionName: PLAYER_A_DELETE_ITEM, error });
      throw error;
    }

    return result;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
