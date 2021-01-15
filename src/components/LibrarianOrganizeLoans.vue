<template>
  <div id="organize-loans">
    <div v-if="!showPage" class="spinner">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div v-if="showPage">
      <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <!--<h5 class="page-title">{{ pagetype }}</h5>-->
              <b-form-input
                size="sm"
                class="mr-sm-2"
                placeholder="User ID"
                v-on:input="useridInput"
              ></b-form-input>
              <b-button
                @click="searchuser"
                size="sm"
                class="my-2 my-sm-0 submitbutton"
                >Search</b-button
              >
              <b-button
                @click="updateuser"
                v-if="this.pagetype !== 'Loans and Returns History'"
                size="sm"
                class="my-2 my-sm-0 submitbutton"
                >Update</b-button
              >
              <h3>{{ username }}</h3>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
      <b-table
        id="books-table"
        :items="items"
        :fields="activefield"
        :per-page="perPage"
        :current-page="currentPage"
        :select-mode="selectMode"
        selectable
        striped
        borderless
        sticky-header="calc(100vh - 56px - 120px)"
        @row-selected="onRowSelected"
      >
        <!-- A virtual column -->
        <template #cell(currentstock)="data">
          {{ data.value }}
        </template>

        <!-- A custom formatted column -->
        <template #cell(name)="data">
          <b class="text-info">{{ data.value.last.toUpperCase() }}</b
          >, <b>{{ data.value.first }}</b>
        </template>

        <template #cell(datedued)="data">
          {{ data.value === "January 01 1970" ? "-" : data.value }}
        </template>

        <template #cell(dateborrowed)="data">
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { bus } from "../main";

export default {
  name: "LibrarianOrganizeLoans",
  computed: {
    rows() {
      return this.items.length;
    },
  },
  mounted() {
    switch (this.$router.currentRoute.path) {
      case "/organizeloans":
        this.pagetype = "Organize Loans";
        this.activefield = this.fieldsloan;
        break;
      case "/organizereturns":
        this.pagetype = "Organize Returns";
        this.activefield = this.fieldsreturn;
        break;
      case "/loanreturnhistory":
        this.pagetype = "Loans and Returns History";
        this.activefield = this.fieldshistory;
        break;
    }
    setTimeout(() => {
      bus.$on("librarianorganizetypechanged", (data) => {
        this.pagetype = "";
        this.showPage = false;
        this.items = [];

        switch (data) {
          case "organizeloans":
            this.pagetype = "Organize Loans";
            this.activefield = this.fieldsloan;
            break;
          case "organizereturns":
            this.pagetype = "Organize Returns";
            this.activefield = this.fieldsreturn;
            break;
          case "loanreturnhistory":
            this.pagetype = "Loans and Returns History";
            this.activefield = this.fieldshistory;
            break;
        }
        this.showPage = true;
      });
    });
  },
  methods: {
    updateuser() {
      console.log(this.bookstobeupdated);

      if (this.bookstobeupdated.length > 0) {
        switch (this.pagetype) {
          case "Organize Loans":
            this.updateloan();
            break;
          case "Organize Returns":
            this.updatereturn();
            break;
        }
      } else {
        alert("Please select at least 1 record.");
      }
    },
    updatereturn() {
      axios
        .post("http://localhost:8000/api/updatereturn", {
          userid: 1,
          bookids: this.bookstobeupdated,
        })
        .then((response) => {
          if (response.data.results) {
            alert("Books return updated successfully.");
          } else {
            alert("Books return update failed.");
          }
          this.$router.go();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
    updateloan() {
      axios
        .post("http://localhost:8000/api/updateloan", {
          userid: 1,
          bookids: this.bookstobeupdated,
        })
        .then((response) => {
          if (response.data.results) {
            alert("Books collection updated successfully.");
          } else {
            alert("Books collection update failed.");
          }
          this.$router.go();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
    useridInput($event) {
      this.searchuserid = $event;
    },
    onRowSelected(selecteditem) {
      this.bookstobeupdated = [];
      selecteditem.forEach((element) => {
        console.log(element);
        this.bookstobeupdated.push(element.loanid);
      });
      console.log(this.bookstobeupdated);
      console.error(this.bookstobeupdated.length);
    },
    searchuser() {
      this.showPage = false;
      let loantype;
      switch (this.$router.currentRoute.path) {
        case "/organizeloans":
          loantype = "loan";
          break;
        case "/organizereturns":
          loantype = "return";
          break;
        case "/loanreturnhistory":
          loantype = "history";
          break;
      }
      axios
        .get("http://localhost:8000/api/organizeloans", {
          params: {
            userid: this.searchuserid,
            loantype: loantype,
          },
        })
        .then((response) => {
          this.searchuserid = 0;
          if (response.data.loanresult.length > 0) {
            this.items = response.data.loanresult;
            this.username = response.data.userresult.username;
          } else {
            this.items = [];
            this.username = "";
          }
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
      bookstobeupdated: [],
      pagetype: "",
      searchuserid: 0,
      showPage: true,
      showLoanButton: false,
      username: "",
      perPage: 10,
      currentPage: 1,
      modalbooktitle: "title",
      activefield: [],
      modalbookcoverimage:
        "https://edit.org/images/cat/book-covers-big-2019101610.jpg",
      selectMode: "multi",
      fieldsloan: [
        { key: "bookcoverimage", label: "" },
        { key: "bookname", label: "Name", sortable: true },
        { key: "bookid", label: "Book ID", sortable: true },
        { key: "dateborrowed", label: "Date Reserved", sortable: true },
        { key: "loanstatus", label: "Status", sortable: true },
        { key: "shelfname", label: "Location", sortable: true },
      ],
      fieldsreturn: [
        { key: "bookcoverimage", label: "" },
        { key: "bookname", label: "Name", sortable: true },
        { key: "bookid", label: "Book ID", sortable: true },
        { key: "dateborrowed", label: "Date Borrowed", sortable: true },
        { key: "datecollected", label: "Date Collected", sortable: true },
        { key: "datedued", label: "Date Dued", sortable: true },
        { key: "dateduepaid", label: "Date Dued Paid", sortable: true },
        { key: "loanstatus", label: "Status", sortable: true },
        { key: "shelfname", label: "Location", sortable: true },
      ],
      fieldshistory: [
        { key: "bookcoverimage", label: "" },
        { key: "bookname", label: "Name", sortable: true },
        { key: "bookid", label: "Book ID", sortable: true },
        { key: "dateborrowed", label: "Date Borrowed", sortable: true },
        { key: "datecollected", label: "Date Collected", sortable: true },
        { key: "datereturned", label: "Date Returned", sortable: true },
        { key: "datedued", label: "Date Dued", sortable: true },
        { key: "dateduepaid", label: "Date Dued Paid", sortable: true },
        { key: "loanstatus", label: "Status", sortable: true },
        { key: "shelfname", label: "Location", sortable: true },
      ],
      items: [],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#organize-loans {
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

.submitbutton {
  width: 100px !important;
  height: 40px !important;
  margin-right: 5px;
}

.form-control-sm {
  width: 200px !important;
  height: 40px !important;
  margin-left: 20px;
}

.page-title {
  max-width: 250px !important;
}
</style>
