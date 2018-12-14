import Vue from 'vue';
import VueRouter from 'vue-router';
import './css/cssreset.css';
import Ajax from './ajax';
import App from './App';
import routes from './router'



Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes,
});


Vue.use(VueRouter);
Vue.use(Ajax);

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
