<template>
  <div id="payduedbooks">
    <div v-if="!showPage" class="spinner">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <b-jumbotron lead="Outstanding Overdued Charges" v-if="showPage">
      <template #header>{{ "$" + totaloverduedcharges }}</template>
      <b-button
        @click="paydues"
        v-if="totaloverduedcharges !== '0.00'"
        variant="primary"
        >Pay Fees</b-button
      >
    </b-jumbotron>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PayDuedBooks",
  mounted() {
    this.getduedbooks();
    // localStorage.removeItem("currentUserType");
  },
  methods: {
    getduedbooks() {
      axios
        .get("http://localhost:8000/api/getduedlist", {
          params: {
            userid: 1,
          },
        })
        .then((response) => {
          console.error(response);
          this.totaloverduedcharges = response.data.overduecharges;
          this.showPage = true;
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
    paydues() {
      axios
        .post("http://localhost:8000/api/paydues", {
          userid: 1,
        })
        .then((response) => {
          if (response.data.results) {
            alert("Fees paid successfully.");
          } else {
            alert("Something went wrong, please refresh page and try again.");
          }
          this.$router.go();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
  },
  data() {
    return {
      showPage: false,
      totaloverduedcharges: 0,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#payduedbooks {
  height: 100%;
  padding: 20px;
}
</style>
