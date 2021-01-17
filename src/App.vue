<template>
  <div id="app">
       <NavHeader v-if="authtoken" @rolechanged="rolechangedTriggered" />
      <div id="app-wrapper">
        <SideBar
          :duedbooksdata="this.duedbooksdata.duedbookscount"
          :currentuser="this.currentUser"
          v-if="authtoken"
        />
        <AppContent />
      </div>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
// import Dashboard from "./components/Dashboard.vue";
import NavHeader from "./components/NavHeader.vue";
import SideBar from "./components/SideBar.vue";
import AppContent from "./components/AppContent.vue";
import { clearSessionInstance } from '../src/services/utility'
import axios from "axios";

export default {
  name: "App",
  components: {
    NavHeader,
    SideBar,
    AppContent,
  },
  data() {
    return {
      authtoken:localStorage.getItem('loginstatus'),
      currentUser: localStorage.getItem("currentUserType")
        ? localStorage.getItem("currentUserType")
        : "User",
      duedbooksdata: [],
      fields: {},
      errors: {},
    };
  },
  mounted() {
    this.getduedbooks();
  },
  methods: {
    rolechangedTriggered($event) {
      this.currentUser = $event;
    },
    getduedbooks() {
      if(localStorage.getItem('activeuserid')){

      const instance = axios.create({
        withCredentials: true,
      });
      instance
        .get("http://127.0.0.1:8000/api/getduedlist", {
          params: {
            userid: localStorage.getItem('activeuserid'),
          },
        })
        .then((response) => {
          console.log(response);
          if(response.data.error){
            clearSessionInstance();
            alert('Session Expired, please log in again.');
            this.$router.go();
          }else{
            this.duedbooksdata = response.data;
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
      }
    
    },
  },
};
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* If you want to implement it in very old browser-versions */
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* The rule below is not implemented in browsers yet */
  -o-user-select: none;

  /* The rule below is implemented in most browsers by now */
  user-select: none;
}
#app-wrapper {
  height: calc(100vh - 56px);
  display: flex;
}

.spinner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#sidebar {
  background-color: #ffdead !important;
}
</style>
