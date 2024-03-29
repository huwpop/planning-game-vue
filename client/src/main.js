import Vue from 'vue';
import App from './App.vue';
// import { BootstrapVue,
//  // IconsPlugin
// } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
//import VuexStore from './vuex-store.js';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheck,
  faTimes,
  faChartPie,
  faDumpsterFire,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheck, faTimes, faChartPie, faDumpsterFire, faLink);

//var url = 'http://localhost:8080';
var url = process.env.HOSTURL;

export const SocketInstance = socketio.connect(url);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketInstance,
  })
);

Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
