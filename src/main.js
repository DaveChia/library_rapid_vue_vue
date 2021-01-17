import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from "vue-router";
import MainDashboard from "./components/MainDashboard.vue";
import BrowseLibrary from "./components/BrowseLibrary.vue";
import Wishlist from "./components/Wishlist.vue";
import BooksOnLoan from "./components/BooksOnLoan.vue";
import PayDuedBooks from "./components/PayDuedBooks.vue";
import LibrarianOrganizeLoans from "./components/LibrarianOrganizeLoans.vue";
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
    path: "/wishlist",
    component: Wishlist
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

export const bus = new Vue();
export const busChangeUserType = new Vue();