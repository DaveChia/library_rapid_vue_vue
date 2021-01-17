<template>
  <div class="container">
    <div class="card card-default">
      <div class="card-header">Library App</div>
      <div class="card-body">
        <div class="alert alert-danger" v-if="has_error">
          <p>Erreur, impossible de se connecter avec ces identifiants.</p>
        </div>
        <form autocomplete="off" method="post">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              type="email"
              id="email"
              class="form-control"
              placeholder="user@example.com"
              v-model="email"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              class="form-control"
              v-model="password"
              required
            />
          </div>
        </form>
        <button type="submit" @click="login" class="btn btn-default">
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      has_error: false,
    };
  },
  mounted() {
    //
  },
  methods: {
    login() {
      const instance = axios.create({
        withCredentials: true,
      });

     instance
        .post("http://127.0.0.1:8000/api/auth/login", {
          email: this.email,
          password: this.password,
          // data: {
          //     "_token": "{{ csrf_token() }}",
          // }
        })
        .then((response) => {
          if(response.data.Login === 'Success'){
            localStorage.setItem('loginstatus',true);
            localStorage.setItem('activeuserid',response.data.userid);
            localStorage.setItem('activeusername',response.data.username);
            alert('Login Successful.');
            this.$router.go();
          }else{
            localStorage.removeItem('loginstatus');
            localStorage.removeItem('activeuserid');
            localStorage.removeItem('activeusername');
            alert('Login Failed.');
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 10vh;
  width:50vw;
}
</style>
