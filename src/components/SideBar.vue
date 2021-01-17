<template>
  <div id="sidebar">
    <div>
      <p />
      <div class="mb-4">
        <b-avatar
          variant="info"
          src="https://placekitten.com/300/300"></b-avatar>
      </div>
      <p>{{activeusername}}</p>
      <p />
      <b-list-group style="max-width: 300px">
        <b-list-group-item
          v-on:click="sidebarNavigate('', $event)"
          class="d-flex align-items-center item sidebar-dashboard">
          <b-avatar class="mr-3"></b-avatar>
          <span class="mr-auto mr-tab-custom-title">Dashboard</span>
        </b-list-group-item>

        <b-list-group-item
          v-on:click="sidebarNavigate('browse', $event)"
          v-if="userCapability && currentuser === 'User'"
          class="d-flex align-items-center item browse">
          <b-avatar variant="primary" icon="bookshelf" class="mr-3"></b-avatar>
          <span class="mr-auto mr-tab-custom-title">Browse Library</span>
        </b-list-group-item>

        <b-list-group-item
          v-on:click="sidebarNavigate('booksonloan', $event)"
          v-if="userCapability && currentuser === 'User'"
          class="d-flex align-items-center item booksonloan">
          <b-avatar variant="success" icon="clock" class="mr-3"></b-avatar>
          <span class="mr-auto mr-tab-custom-title">Loans History</span>
        </b-list-group-item>

        <b-list-group-item
          v-on:click="sidebarNavigate('duedBooks', $event)"
          v-if="userCapability && currentuser === 'User'"
          class="d-flex align-items-center item duedBooks">
          <b-avatar variant="danger" icon="wallet-fill" class="mr-3"></b-avatar>
          <span class="mr-auto mr-tab-custom-title">Pay Overdues</span>
          <b-badge class="animated shake" v-if="this.duedbooksdata > 0">{{this.duedbooksdata}}</b-badge>
        </b-list-group-item>

        <b-list-group-item
          v-on:click="sidebarNavigate('organizeloans', $event)"
          v-if="librarianCapability && currentuser === 'Librarian'"
          class="d-flex align-items-center item organizeloans">
          <b-avatar
            variant="primary"
            icon="arrow-bar-down"
            class="mr-3"></b-avatar>
          <span class="mr-auto mr-tab-custom-title">Organize Loans</span>
        </b-list-group-item>

        <b-list-group-item
          v-on:click="sidebarNavigate('organizereturns', $event)"
          v-if="librarianCapability && currentuser === 'Librarian'"
          class="d-flex align-items-center item organizereturns">
          <b-avatar
            variant="danger"
            icon="arrow-bar-up"
            class="mr-3"></b-avatar>
          <span class="mr-auto mr-tab-custom-title">Organize Returns</span>
        </b-list-group-item>

        <b-list-group-item
          v-on:click="sidebarNavigate('loanreturnhistory', $event)"
          v-if="librarianCapability && currentuser === 'Librarian'"
          class="d-flex align-items-center item loanreturnhistory">
          <b-avatar variant="success" icon="clock" class="mr-3"></b-avatar>
          <span class="mr-auto mr-tab-custom-title">Loans History</span>
        </b-list-group-item>
       
      </b-list-group>
    </div>
  </div>
</template>

<script>
import { bus } from "../main";
import { busChangeUserType } from "../main";

export default {
  name: "Sidebar",
  props: {
    duedbooksdata: Number,
    currentuser: String,
  },
  mounted(){
    
  },
  created() {
    this.librarianCapability = true;
    this.librarianCanOrganizeBooksCapability = true;
    this.librarianCanOrganizeUsersCapability = true;
    this.librarianAdminCapability = true;
    this.userCapability = true;

    setTimeout(() => {
      this.initialSidebarActive();
      busChangeUserType.$on("usertypechanged", () => {
        let currentActiveSideBarElement = document.querySelector(
          ".sidebar-active"
        );
        if (currentActiveSideBarElement) {
          currentActiveSideBarElement.classList.remove("sidebar-active");
        }
        let dashboardSideBarElement = document.querySelector(
          ".sidebar-dashboard"
        );
        if (dashboardSideBarElement) {
          dashboardSideBarElement.classList.add("sidebar-active");
        }
      });
    });
  },
  methods: {
    // Toggle side bar selection
    sidebarNavigate: function (inputType, $event) {
      if (this.$router.history.current.path !== "/" + inputType) {
        this.toggleActiveSideBarElement($event);
        this.$router.push("/" + inputType);
        if (
          inputType === "organizeloans" ||
          inputType === "organizereturns" ||
          inputType === "loanreturnhistory"
        ) {
          bus.$emit("librarianorganizetypechanged", inputType);
        }
      }
    },
    // Highlight sidebar element when component loads
    initialSidebarActive: function () {
      let activeClass = '.'+this.$router.history.current.path.replace('/','');
      if(this.$router.history.current.path === '/'){
        activeClass = '.sidebar-dashboard';
      }
      const currentActiveSidebar = document.querySelector(activeClass);
      currentActiveSidebar.classList.add("sidebar-active");
    },
    // Highlight sidebar element when selected element is clicked or in route
    toggleActiveSideBarElement($event) {
      let currentActiveSideBarElement = document.querySelector(
        ".sidebar-active"
      );
      if (currentActiveSideBarElement) {
        currentActiveSideBarElement.classList.remove("sidebar-active");
      }
      if (!$event.target.classList.contains("sidebar-active")) {
        $event.target.classList.add("sidebar-active");
      } else {
        $event.target.classList.remove("sidebar-active");
      }
    },
  },
  data() {
    return {
      activeusername: localStorage.getItem('activeusername'),
      sidebaractive: [true, true, true, true, true, true, true, true],
      librarianCapability: false,
      librarianCanOrganizeBooksCapability: false,
      librarianCanOrganizeUsersCapability: false,
      librarianAdminCapability: false,
      userCapability: false,
    };
  },
};
</script>



<style>
#sidebar {
  width: 200px;
  height: 100%;
  background-color: orange;
}

.item {
  cursor: pointer;
}

.mr-tab-custom-title {
  font-size: 12px;
}

.animated {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
}

@-webkit-keyframes shake {
  0%,
  100% {
    -webkit-transform: translateY(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translateY(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translateY(5px);
  }
}
@keyframes shake {
  0%,
  100% {
    transform: translateY(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateY(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateY(5px);
  }
}
.shake {
  -webkit-animation-name: shake;
  animation-name: shake;
}

.mr-tab-custom-title {
  pointer-events: none;
}

.sidebar-active {
  background-color: #0020c2 !important;
  color: #fff;
}
</style>