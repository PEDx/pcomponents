import Vue from 'vue';
import VueRouter from 'vue-router';
import './css/cssreset.css';
import './css/main.css';
import Ajax from './ajax';
import App from './App';
import routes from './router'
import vueTap from 'v-tap';
import Loading from './components/Loading';
import 'vant/lib/icon/local.css';
import {
  Cell, CellGroup, Picker,
  Popup,
  Field,
  Toast,
  Icon,
  Button,
} from 'vant';


Vue.config.productionTip = false;

const router = new VueRouter({
  // mode: 'history',
  routes,
});


Vue.use(VueRouter);
Vue.use(Ajax);
Vue.use(Loading);
Vue.use(Toast);
Vue.use(Icon);
Vue.use(Button);
Vue.use(vueTap);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Field);
Vue.use(Cell).use(CellGroup);

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
