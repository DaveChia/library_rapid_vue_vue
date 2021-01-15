<template>
  <div id="browse-library">
    <div v-if="!showPage" class="spinner">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div v-if="showPage">
      <!--
      <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <b-form-input
                size="sm"
                class="mr-sm-2"
                placeholder="Book Name"
                v-on:input="booknameInput"
              ></b-form-input>
              <b-form-input
                size="sm"
                class="mr-sm-2"
                placeholder="Genre"
                v-on:input="bookgenreInput"
              ></b-form-input>
              <b-button @click="searchbooks" size="sm" class="my-2 my-sm-0"
                >Search</b-button
              >
              <b-button @click="getallbooklist" size="sm" class="my-2 my-sm-0"
                >Reset</b-button
              >
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>-->
      <b-table
        id="books-table"
        :items="items"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        :select-mode="selectMode"
        selectable
        @row-selected="onRowSelected"
        striped
        borderless
        sticky-header="calc(100vh - 56px - 120px)"
      >
        <!-- A virtual column -->
        <template
          #cell(currentstock)="data"
          :class="darkMode ? 'dark-theme' : 'light-theme'"
        >
          {{ data.value > 0 ? "Yes" : "No" }}
        </template>

        <!-- A custom formatted column -->
        <template #cell(name)="data">
          <b class="text-info">{{ data.value.last.toUpperCase() }}</b
          >, <b>{{ data.value.first }}</b>
        </template>

        <!-- Optional default data cell scoped slot -->
        <template #cell(bookcoverimage)="data">
          <img v-bind:src="`${data.value}`" width="40" height="60" />
        </template>
      </b-table>

      <div id="pagination-wrapper">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="books-table"
        ></b-pagination>
      </div>

      <b-modal ref="my-modal" hide-footer size="xl">
        <template #modal-header>
          <h5>{{ modalbooktitle }}</h5>
        </template>
        <b-row id="row-wrapper">
          <div id="left">
            <img v-bind:src="`${modalbookcoverimage}`" width="300" />
          </div>
          <b-col id="right">
            <div class="right-content"></div>
            <div class="right-content"></div>
            <b-button
              v-if="showLoanButton"
              block
              @click="loanbook"
              variant="success"
              >Loan Book</b-button
            >
          </b-col>
        </b-row>
        <b-button class="mt-3" block @click="hideModal">Close</b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BrowseLibrary",
  beforeMount() {
    this.getallbooklist();
  },
  computed: {
    rows() {
      return this.items.length;
    },
  },
  methods: {
    booknameInput($event) {
      this.searchbookname = $event;
    },
    bookgenreInput($event) {
      this.searchgenrename = $event;
    },
    onRowSelected(item) {
      this.modalbooktitle = item[0]["bookname"];
      this.modalbookcoverimage = item[0]["bookcoverimage"];
      this.modalbookid = item[0]["id"];
      if (item[0]["currentstock"] > 0) {
        this.showLoanButton = true;
      }
      this.showModal(item[0]);
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    getallbooklist() {
      this.showPage = false;
      axios
        .get("http://localhost:8000/api/getbooklist")
        .then((response) => {
          console.log(response);
          this.items = response.data;
          this.showPage = true;
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
    getbook() {
      axios
        .get("http://localhost:8000/api/getbook", {
          params: {
            bookid: 12345,
          },
        })
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
    loanbook() {
      this.showLoanButton = false;
      axios
        .post("http://localhost:8000/api/loanbook", {
          bookid: this.modalbookid,
          userid: 1,
        })
        .then((response) => {
          console.log(response);
          if (response.data.loanresult === true) {
            this.getallbooklist();
            alert(
              "Book Reserved Successfully, please proceed to collect our book."
            );
          } else {
            alert(response.data.loanresult);
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
    searchbooks() {
      this.showPage = false;
      axios
        .get("http://localhost:8000/api/searchbooks", {
          params: {
            bookname: this.searchbookname,
            bookgenre: this.searchgenrename,
          },
        })
        .then((response) => {
          this.items = response.data.searchresults;
          this.showPage = true;
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
      searchbookname: "",
      searchgenrename: "",
      showPage: false,
      showLoanButton: false,
      perPage: 10,
      currentPage: 1,
      modalbookid: 0,
      modalbooktitle: "title",
      modalbookcoverimage:
        "https://edit.org/images/cat/book-covers-big-2019101610.jpg",
      selectMode: "single",
      fields: [
        { key: "bookcoverimage", label: "" },
        { key: "bookname", label: "Name", sortable: true },
        { key: "genrename", label: "Genre", sortable: true },
        { key: "currentstock", label: "Availability", sortable: true },
        { key: "shelfname", label: "Book Location", sortable: true },
        { key: "isbn", label: "ISBN", sortable: true },
      ],
      items: [],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#browse-library {
  height: 100%;
  padding: 20px;
}
.bg-info {
  background-color: transparent !important;
  margin-bottom: 15px;
}

.ml-auto {
  margin-left: 0 !important;
}

#books-table {
  height: calc(100vh - 56px - 220px);
}

#pagination-wrapper {
  display: flex;
  justify-content: center;
}

#left {
  background-color: red;
  width: fit-content;
}

#right {
  display: flex;
  flex-direction: column;
}

#row-wrapper {
  padding: 0px 20px;
}

.right-content {
  flex: 1;
}
</style>
