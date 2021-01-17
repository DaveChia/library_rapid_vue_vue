import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from "vue-router";
import MainDashboard from "./components/MainDashboard.vue";
import BrowseLibrary from "./components/user/BrowseLibrary";
import BooksOnLoan from "./components/user/BooksOnLoan";
import PayDuedBooks from "./components/user/PayDuedBooks";
import LibrarianOrganizeLoans from "./components/librarian/LibrarianOrganizeLoans.vue";
import Login from "./components/auth/login.vue";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

// Vue Router
Vue.use(VueRouter);
const routes = [
  {
    path: "",
    component: MainDashboard
  }, {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      public: true,
    },
  }, {
    path: "/browse",
    name: "browse",
    component: BrowseLibrary
  }, {
    path: "/booksonloan",
    component: BooksOnLoan
  }, {
    path: "/duedBooks",
    component: PayDuedBooks
  }, {
    path: "/organizeloans",
    component: LibrarianOrganizeLoans
  }, {
    path: "/organizereturns",
    component: LibrarianOrganizeLoans
  }, {
    path: "/loanreturnhistory",
    component: LibrarianOrganizeLoans
  }, {
    path: "*",
    redirect: '/',
    component: MainDashboard
  },
];
const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
});

// View route authentications
router.beforeEach((to, from, next) => {
  if (to.path != '/login' && !localStorage.getItem('loginstatus')) {
    next({
      name: 'login'
    });
  } else if (to.path == '/login' && localStorage.getItem('loginstatus')) {
    next({
      path: ""
    });
  } else {
    next();
  }
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

//  Global Bus Broastcast events
export const bus = new Vue();
export const busChangeUserType = new Vue();