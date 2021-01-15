<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">My Library App</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>{{ currentUserType }}</em>
            </template>
            <b-dropdown-item>Profile</b-dropdown-item>
            <b-dropdown-item
              v-if="
                librarianCapability &&
                userCapability &&
                currentUserType === 'Librarian'
              "
              v-on:click="navFuntions(currentUserType)"
              >Switch Role to User</b-dropdown-item
            >
            <b-dropdown-item
              v-if="
                librarianCapability &&
                userCapability &&
                currentUserType === 'User'
              "
              v-on:click="navFuntions(currentUserType)"
              >Switch Role to Librarian</b-dropdown-item
            >
            <b-dropdown-item>Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { busChangeUserType } from "../main";
export default {
  name: "NavHeader",
  created() {
    this.librarianCapability = true;
    this.userCapability = true;
  },
  data() {
    return {
      currentUserType: !localStorage.getItem("currentUserType")
        ? "User"
        : localStorage.getItem("currentUserType"),
      librarianCapability: false,
      librarianCanOrganizeBooksCapability: false,
      librarianCanOrganizeUsersCapability: false,
      librarianAdminCapability: false,
      userCapability: false,
    };
  },
  methods: {
    navFuntions: function (inputType) {
      switch (inputType) {
        case "User":
          this.currentUserType = "Librarian";
          localStorage.setItem("currentUserType", this.currentUserType);
          this.$emit("rolechanged", this.currentUserType);
          busChangeUserType.$emit("usertypechanged");
          if (this.$router.currentRoute.path !== "/") {
            this.$router.push("/");
          }

          break;
        case "Librarian":
          this.currentUserType = "User";
          localStorage.setItem("currentUserType", this.currentUserType);
          busChangeUserType.$emit("usertypechanged");
          this.$emit("rolechanged", this.currentUserType);
          if (this.$router.currentRoute.path !== "/") {
            this.$router.push("/");
          }
          break;
      }
    },
  },
};
</script>

<style scoped>
.bg-info {
  background-color: #ff8c00 !important;
}
</style>