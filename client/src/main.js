import Vue from 'vue'
import App from './App.vue'
// import { BootstrapVue, 
//  // IconsPlugin 
// } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
//import VuexStore from './vuex-store.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { check } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


library.add(check);

export const SocketInstance = socketio.connect('http://localhost:3000');


Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.use(new VueSocketIO(
  {
  debug: true,
  connection: SocketInstance,
}),
);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
