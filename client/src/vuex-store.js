import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    newMessage: null,
    messages: [],
    typing: false,
    username: null,
    ready: false,
    info: [],
    connections: 0,
  },

  mutations:{
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    },

    SOCKET_MESSAGECHANNEL(state, message) {
      state.socketMessage = message
    }
  }
})