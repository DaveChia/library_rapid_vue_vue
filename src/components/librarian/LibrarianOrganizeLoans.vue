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
              <b-form-input
                size="sm"
                class="mr-sm-2"
                placeholder="User ID"
                v-on:input="useridInput"></b-form-input>
              <b-button
                @click="searchuser"
                size="sm"
                class="my-2 my-sm-0 submitbutton">Search</b-button>
              <b-button
                @click="updateuser"
                v-if="this.pagetype !== 'Loans and Returns History'"
                size="sm"
                class="my-2 my-sm-0 submitbutton">Update</b-button>
              <h4 id="username-container">User: {{ username }}</h4>
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
        @row-selected="onRowSelected">
        
        <template #cell(currentstock)="data">
          {{ data.value }}
        </template>

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

        <template #cell(datecancelled)="data">
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
import { bus } from "../../main";
import { clearSessionInstance } from '../../services/utility'

export default {
  name: "LibrarianOrganizeLoans",
  computed: {
    rows() {
      return this.items.length;
    },
  },
  mounted() {
 
    this.toggleorganizetype(this.$router.currentRoute.path.replace('/',''));

    setTimeout(() => {
      bus.$on("librarianorganizetypechanged", (data) => {
        this.pagetype = "";
        this.showPage = false;
        this.items = [];
        this.toggleorganizetype(data);
        this.showPage = true;
      });
    });
  },
  methods: {
    //  Toggle form for librarian organization
    toggleorganizetype(data){

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

    },
    //  Trigger updating user loan/borrowers record
    updateuser() {

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
    //  Trigger api for borrowers to return books
    updatereturn() {
        console.log('asdasdas');
      const instance = axios.create({
        withCredentials: true,
      });
      instance
        .post("http://127.0.0.1:8000/api/updatereturn", {
          userid: localStorage.getItem('activeuserid'),
          bookids: this.bookstobeupdated,
        })
        .then((response) => {
          if(response.data.error){
            clearSessionInstance();
            alert('Session Expired, please log in again.');
            this.$router.go();
          }else{
            if (response.data.results) {
              alert("Books return updated successfully.");
            } else {
              alert("Books return update failed.");
            }
            this.$router.go();
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
    //  Trigger api for borrowers to loan books
    updateloan() {
      const instance = axios.create({
        withCredentials: true,
      });

      instance
        .post("http://127.0.0.1:8000/api/updateloan", {
          userid: this.searchuserid,
          bookids: this.bookstobeupdated,
        })
        .then((response) => {
          if(response.data.error){
            clearSessionInstance();
            alert('Session Expired, please log in again.');
            this.$router.go();
          }else{
            if (response.data.results) {
              alert("Books collection updated successfully.");
            } else {
              alert("Books collection update failed.");
            }
            this.$router.go();
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {};
          }
        });
    },
    //  Updates input form 
    useridInput($event) {
      this.searchuserid = $event;
    },

    //  Update selected books
    onRowSelected(selecteditem) {
      this.bookstobeupdated = [];
      selecteditem.forEach((element) => {
        this.bookstobeupdated.push(element.loanid);
      });
    },

    // Search and retrieve user records based on user id
    searchuser() {
      this.showPage = false;
      let loantypeinput;
      switch (this.$router.currentRoute.path) {
        case "/organizeloans":
          loantypeinput = "loan";
          break;
        case "/organizereturns":
          loantypeinput = "return";
          break;
        case "/loanreturnhistory":
          loantypeinput = "history";
          break;
      }

      const instance = axios.create({
        withCredentials: true,
      });

      instance
        .get("http://127.0.0.1:8000/api/organizeloans", {
          params: {
            userid: this.searchuserid,
            loantype: loantypeinput,
          },
        })
        .then((response) => {
          console.warn(response,this.searchuserid);
          if(response.data.error){
            clearSessionInstance();
            alert('Session Expired, please log in again.');
            this.$router.go();
          }else{
            if(response.data.userresult){
              this.username = response.data.userresult.name;
            }
            
            if (response.data.loanresult.length > 0) {
              this.items = response.data.loanresult;
            } else {
              this.items = [];
            }
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
      modalbookcoverimage:"",
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
        { key: "datecancelled", label: "Date Cancelled", sortable: true },
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

#username-container{
  margin-left:20px;
  line-height:40px;
}
</style>
