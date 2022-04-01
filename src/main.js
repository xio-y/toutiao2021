// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import moment from 'moment/moment'
import './assets/css/index.css'

Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
   return moment(value).format(formatString); // value可以是普通日期 20170723
  //return moment.unix(value).format(formatString); // 这是时间戳转时间
});

Vue.use(Vant);
Vue.use(VueAxios,axios)
axios.defaults.baseURL='http://localhost:8080/news2022/';
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
