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

export const SocketInstance = socketio.connect('http://localhost:3000');

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
