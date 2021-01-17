<template>
  <div id="main-dashboard">
    <div id="main-dashboard-jumbotron-wrapper">
      <b-jumbotron
        header="BootstrapVue"
        lead="Bootstrap v4 Components for Vue.js 2"
      >
        <p>For more information visit website</p>
        <b-button variant="primary" href="#">More Info</b-button>
      </b-jumbotron>
    </div>
    <div id="main-dashboard-cards">
      <!-- <b-card
        title="Wish List"
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem"
        class="mb-2"
      >
        <b-card-text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </b-card-text>

        <b-button href="http://www.google.com" variant="primary"
          >Go somewhere</b-button
        >
      </b-card> -->
      <b-card
        title="Books On Loans"
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem"
        class="mb-2"
      >
        <b-card-text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </b-card-text>

        <b-button href="http://www.google.com" variant="primary"
          >Go somewhere</b-button
        >
      </b-card>
      <b-card
        title="Due Books"
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem"
        class="mb-2"
      >
        <b-card-text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </b-card-text>

        <b-button href="http://www.google.com" variant="primary"
          >Go somewhere</b-button
        >
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainDashboard",
  props: {
    duedBooksData: Array,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main-dashboard {
  height: 100%;
}

#main-dashboard-cards {
  padding: 20px;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

#main-dashboard-jumbotron-wrapper {
  padding: 20px;
}
</style>
