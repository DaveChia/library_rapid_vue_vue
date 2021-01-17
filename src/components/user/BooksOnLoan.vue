<template>
  <div id="books-onloans">
    <div v-if="!showPage" class="spinner">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div v-if="showPage">
      <b-table
        id="books-table"
        :items="items"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        striped
        borderless
        sticky-header="calc(100vh - 56px - 120px)"
      >

        <template #cell(currentstock)="data">
          {{ data.value }}
        </template>

        <template #cell(loanstatus)="data">
          {{
            data.value === 1
              ? "Reserved"
              : data.value === 2
              ? "Collected"
              : data.value === 3
              ? "Returned"
              : data.value === 4
              ? "Overdued"
              : data.value === 5
              ? "Cancelled"
              : data.value === 6
              ? "Returned with Outstanding Dues"
              : data.value === 7
              ? "Returned with Dues Paid"
              : data.value === 8
              ? "Dues Paid without Returning"
              : "Others"
          }}
        </template>

        <template #cell(datedued)="data">
          {{ data.value === "January 01 1970" ? "-" : data.value }}
        </template>

        <template #cell(dateborrowed)="data">
          {{ data.value === "January 01 1970" ? "-" : data.value }}
        </template>

         <template #cell(datecancelled)="data">
          {{ data.value === "January 01 1970" ? "-" : data.value }}
        </template>

        <template #cell(datereturned)="data">
          {{ data.value === "January 01 1970" ? "-" : data.value }}
        </template>

        <template #cell(datecollected)="data">
          {{ data.value === "January 01 1970" ? "-" : data.value }}
        </template>

        <template #cell(dateduepaid)="data">
          {{ data.value === "January 01 1970" ? "-" : data.value }}
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

      <b-modal ref="my-modal" hide-footer title="Using Component Methods">
        <div class="d-block text-center">
          <h3>Hello From My Modal!</h3>
        </div>
        <b-button class="mt-3" variant="outline-danger" block @click="hideModal"
          >Close Me</b-button
        >
        <b-button
          class="mt-2"
          variant="outline-warning"
          block
          @click="toggleModal"
          >Toggle Me</b-button
        >
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { clearSessionInstance } from '../../services/utility'

export default {
  name: "BooksOnLoans",
  beforeMount() {
    this.getloanbooklist();
  },
  computed: {
    rows() {
      return this.items.length;
    },
  },
  methods: {
    onRowSelected(item) {
      this.modalbooktitle = item[0]["bookname"];
      this.showModal(item[0]);
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    toggleModal() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    getloanbooklist() {
      const instance = axios.create({
        withCredentials: true,
      });

      instance
        .get(
          "http://127.0.0.1:8000/api/getloanlist",
          {
            params: {
              userid: localStorage.getItem('activeuserid'),
            },
          }
        )
        .then((response) => {
           if(response.data.error){
            clearSessionInstance();
            alert('Session Expired, please log in again.');
            this.$router.go();
          }else{
            this.items = response.data.loanbooksdata;
            this.showPage = true;
          }
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
      perPage: 10,
      currentPage: 1,
      fields: [
        { key: "bookcoverimage", label: "" },
        { key: "bookname", label: "Name", sortable: true },
        { key: "dateborrowed", label: "Date Borrowed", sortable: true },
        { key: "datecancelled", label: "Date Cancelled", sortable: true },
        { key: "datecollected", label: "Date Collected", sortable: true },
        { key: "datedued", label: "Date Dued", sortable: true },
        { key: "dateduepaid", label: "Date Dued Paid", sortable: true },
        { key: "datereturned", label: "Date Returned", sortable: true },
        { key: "loanstatus", label: "Loan Status", sortable: true },
      ],
      items: [],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#books-onloans {
  height: 100%;
  padding: 20px;
}
#books-table {
  height: calc(100vh - 56px - 220px);
}

#pagination-wrapper {
  display: flex;
  justify-content: center;
}
</style>
