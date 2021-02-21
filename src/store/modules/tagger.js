/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
// import Vue from 'vue';
import { getHeaders } from '../../utils/utils';
import {
  TAGGER_G_TAGS,
  TAGGER_M_ADD_ERROR,
  TAGGER_A_FETCH_TAGS,
  TAGGER_A_FETCH_CATEGORIES,
  TAGGER_G_CATEGORIES,
} from '../types';

const BASE_URL = process.env.VUE_APP_BASE_URL || '';

const state = () => ({
  tagsFetched: false,
  tags: [],

  categoriesFetched: false,
  categories: [],

  errors: [],
});

const getters = {
  [TAGGER_G_TAGS]: (state) => state.tags,

  [TAGGER_G_CATEGORIES]: (state) => state.categories,
};

const mutations = {
  [TAGGER_M_ADD_ERROR] (state, { actionName, error }) {
    const e = {};
    e[actionName] = error;
    state.errors.push(e);
    // eslint-disable-next-line no-console
    console.error(actionName, error);
  },

  _setTagsFetched (state, value) { state.tagsFetched = value },

  _setCategoriesFetched (state, value) { state.categoriesFetched = value },

  _setTags (state, tags) {
    state.tags = tags;
  },

  _setCategories (state, categories) {
    state.categories = categories;
  },
};

const actions = {

  async [TAGGER_A_FETCH_TAGS] ({ state, commit, getters }) {
    const tags = getters[TAGGER_G_TAGS];

    if (tags && state.tagsFetched) {
      return tags;
    }

    const url = `${BASE_URL}/api/getAllTags`;
    const opts = {
      method: 'POST', // TODO: should be a GET ?
      headers: getHeaders(),
    };

    const onError = (error) => {
      commit(TAGGER_M_ADD_ERROR, {
        actionName: TAGGER_A_FETCH_TAGS, error,
      });
      return error;
    };

    const response = await fetch(url, opts)
      .then((response) => response.json().then((json) => {
        if (json.success) {
          const { tags } = json;
          commit('_setTags', tags);
        }

        if (json.error) { onError(json) }

        return getters[TAGGER_G_TAGS];
      }))
      .catch((error) => onError({ error: true, publicMessage: error.toString() }))
      .finally(() => {
        commit('_setTagsFetched', true);
      });

    return response;
  },

  async [TAGGER_A_FETCH_CATEGORIES] ({ state, commit, getters }) {
    const categories = getters[TAGGER_G_CATEGORIES];

    if (categories && state.categoriesFetched) {
      return categories;
    }

    const url = `${BASE_URL}/api/getAllTagCategories`;
    const opts = {
      method: 'POST', // TODO: should be a GET ?
      headers: getHeaders(),
    };

    const onError = (error) => {
      commit(TAGGER_M_ADD_ERROR, {
        actionName: TAGGER_A_FETCH_CATEGORIES, error,
      });
      return error;
    };

    const response = await fetch(url, opts)
      .then((response) => response.json().then((json) => {
        if (json.success) {
          const categories = json.tagCategories;
          commit('_setCategories', categories);
        }

        if (json.error) { onError(json) }

        return getters[TAGGER_G_CATEGORIES];
      }))
      .catch((error) => onError({ error: true, publicMessage: error.toString() }))
      .finally(() => {
        commit('_setCategoriesFetched', true);
      });

    return response;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
