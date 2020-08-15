import Vue from 'vue';
import Vuex from 'vuex';

import {
  INDEX_G_SHOW_THE_LEFT_MENU,
  INDEX_G_SHOW_THE_OVERLAY,
  INDEX_G_SHOW_THE_HELP,
  INDEX_G_SHOW_THE_PLAYER,
  INDEX_G_THE_OVERLAY_OPACITY,

  INDEX_M_SHOW_THE_LEFT_MENU,
  INDEX_M_SHOW_THE_OVERLAY,
  INDEX_M_SHOW_THE_HELP,
  INDEX_M_SHOW_THE_PLAYER,

  INDEX_A_PLAYER_START,
  INDEX_A_PLAYER_STOP,

  PLAYER_M_START,
  PLAYER_M_STOP,
} from './types';

import diaposhuffle from './modules/diaposhuffle';
import player from './modules/player';

Vue.use(Vuex);

const DEFAULT_THE_OVERLAY_OPACITY = 0.9;

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: () => ({
    showTheLeftMenu: true,
    showTheOverlay: false,
    showTheHelp: false,
    showThePlayer: false,

    theOverlayOpacity: DEFAULT_THE_OVERLAY_OPACITY,
  }),

  getters: {
    [INDEX_G_SHOW_THE_LEFT_MENU]: (state) => state.showTheLeftMenu,
    [INDEX_G_SHOW_THE_OVERLAY]: (state) => state.showTheOverlay,
    [INDEX_G_SHOW_THE_HELP]: (state) => state.showTheHelp,
    [INDEX_G_SHOW_THE_PLAYER]: (state) => state.showThePlayer,

    [INDEX_G_THE_OVERLAY_OPACITY]:
      (state) => state.theOverlayOpacity || DEFAULT_THE_OVERLAY_OPACITY,
  },

  mutations: {
    [INDEX_M_SHOW_THE_LEFT_MENU] (state, show) { state.showTheLeftMenu = show },

    [INDEX_M_SHOW_THE_OVERLAY] (state, show) { state.showTheOverlay = show },

    [INDEX_M_SHOW_THE_HELP] (state, show) {
      state.showTheOverlay = show;
      state.showTheHelp = show;
    },

    [INDEX_M_SHOW_THE_PLAYER] (state, show) {
      state.showTheOverlay = show;
      state.showThePlayer = show;
      state.theOverlayOpacity = show ? 1 : 0;
    },
  },

  actions: {
    [INDEX_A_PLAYER_START] ({ commit }) {
      commit(INDEX_M_SHOW_THE_PLAYER, true);
      commit(`player/${PLAYER_M_START}`);
    },
    [INDEX_A_PLAYER_STOP] ({ commit }) {
      commit(INDEX_M_SHOW_THE_PLAYER, false);
      commit(`player/${PLAYER_M_STOP}`);
    },
  },

  modules: {
    diaposhuffle,
    player,
  },
});

// Player.init({ store });

export default store;
