<template>
  <!-- <div v-if="ready">
        <p v-for="user in info" :key="user.id">
          {{ user.username }} {{ user.type }}
        </p>
      </div> -->
  <div>
    <div v-if="!ready">
      <div class="container">
        <div class="col-lg-6 offset-lg-3">
          <h4>Enter your username</h4>
          <form @submit.prevent="addUser">
            <div class="form-group row">
              <input
                type="text"
                class="form-control col-9"
                v-model="username"
                placeholder="Enter username here"
              />
              <input
                type="submit"
                value="Join"
                class="btn btn-sm btn-info ml-1"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- <h2 v-else>{{ username }}</h2> -->
    <div v-if="ready">
      <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap px-0">
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#"
          >Planning Game</a
        >
        <ul class="navbar-nav px-3">
          <li class="nav-item text-nowrap">
            <a v-if="!displayEstimates" v-on:click="showEstimates" class="nav-link btn btn-dark" href="#">Results</a>
          </li>
          <!-- <li class="nav-item text-nowrap">
            <a v-if="displayEstimates" v-on:click="showStats" class="nav-link btn btn-dark" href="#"><font-awesome-icon icon="chart-pie" /></a>
          </li> -->
        </ul>
        <input
          class="form-control form-control-dark w-100"
          type="text"
          placeholder="Task ID / Description"
          aria-label="Task ID / Description"
          v-model="taskId"
          v-on:keyup="sendTaskId" 
        />
        <ul class="navbar-nav px-3">
          <li class="nav-item text-nowrap">
            <a v-on:click="resetBoard" class="nav-link" href="#">Reset</a>
          </li>
          <li class="nav-item text-nowrap">
            <a v-on:click="bootAll" class="nav-link" href="#"><font-awesome-icon icon="dumpster-fire" /></a>
          </li>
        </ul>
      </nav>
      <div class="container-fluid" style="min-height: calc(100vh - 58px);">
        <div class="row">
          <main role="main" class="col-12 p-4">
            <div
              class="d-flex justify-content-around flex-wrap flex-md-nowrap align-items-center pb-2 mb-3"
            >

              <div v-for="(userObj, userId) in users" :key="userId" :id="'user-' + userId" :tooltip="userObj.username" class="card text-white bg-dark" style="max-width: 10rem" >
                <!-- <div v-if="Array.isArray(cardsInPlay)" class="card-header text-center h2">?</div> -->
                <div  v-if="!displayEstimates" class="card-header text-center h2">
                  <span class="text-right col-2 px-0" v-if="userObj.voted"><font-awesome-icon icon="check" /></span>
                  <span class="text-right col-2 px-0" v-else-if="!userObj.voted"><font-awesome-icon icon="times" /></span>
                </div>
                <div v-else-if="displayEstimates" class="card-header text-center h2">
                  <span class="text-right col-2 px-0" v-if="userObj.voted">{{ userObj.estimate }}</span>
                  <span class="text-right col-2 px-0" v-else-if="!userObj.voted"><font-awesome-icon icon="times" /></span>
                </div>
                  <p v-if="userObj.username.length < 25" class="card-text text-white text-center px-2">
                    {{ userObj.username }}
                  </p>
                  <p v-else class="card-text text-white text-center px-2">
                    {{userObj.username.length}}
                    {{ userObj.username.slice(0, 25) + "..." }}
                  </p>
                </div>
              </div>

          </main>
        </div>
      </div>
      <nav class="navbar fixed-bottom navbar-expand-sm navbar-dark bg-dark">
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav col-12 row px-0 mx-0 d-flex justify-content-around">
            <div
              class="nav-item col"
              v-for="estimate in allowedEsimates"
              :key="estimate"
            >
              <input class="d-none" :id="estimate + '-label'" type="radio" :value="estimate" v-on:click="submitEstimate(estimate)"/>
              <label class="nav-link btn btn-dark col-12 mb-0" :for="estimate + '-label'">{{ estimate }}</label>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      users: {},
      allowedEsimates: [],
      cardsInPlay: [],
      taskId: null,
      username: null,
      ready: false,
      displayEstimates: false,
      connections: 0,
    };
  },

  // created() {
  //   window.onbeforeunload = function () {
  //     this.$socket.emit("leave", this.username);
  //   };
  // },

  sockets: {
    connections: function (data) {
      this.connections = data;
    },

    allowedEsimates: function (data) {
      this.allowedEsimates = data;
    },

    userPool: function (data) {
      //console.log(data);
      this.users = data;
    },

    updateBored: function (data) {
      //this.cardsInPlay = data.estimates;
      this.users = data.users;
    },

    displayEstimates: function (data) {
      this.displayEstimates = data.displayEstimates;
      this.users = data.users;
      //this.cardsInPlay = data.estimates;
    },

    resetGame: function (data) {
      //TODO duplicate of update board
      this.users = data.users;
      this.displayEstimates = data.displayEstimates;
      this.taskId = null;
    },

    updateTaskId: function (data) {
      this.taskId = data;
    },

    bootAll: function() {
      this.users = {};
      this.allowedEsimates = [];
      this.cardsInPlay = [];
      this.taskId = null;
      this.username = null;
      this.ready = false;
      this.displayEstimates = false;
      this.connections =  0;
      location.reload();
    },

    // showStats: function(stats) {
    //   console.log(stats)
    //   this.$swal('Hello Vue world!!!');
    // }
    
  },

  watch: {
    // newMessage(value) {
    //   value
    //     ? this.$socket.emit("typing", this.username)
    //     : this.$socket.emit("stopTyping");
    // },
  },

  methods: {
    // send() {
    //   this.messages.push({
    //     message: this.newMessage,
    //     type: 0,
    //     user: "Me",
    //   });

    //   this.$socket.emit("chat-message", {
    //     message: this.newMessage,
    //     user: this.username,
    //   });
    //   this.newMessage = null;
    // },

    submitEstimate(estimate) {
      this.$socket.emit("sendEstimate", estimate);
    },

    addUser() {
      this.ready = true;
      this.$socket.emit("joined", this.username);
    },

    showEstimates() {
      this.$socket.emit("showEstimates");
    },

    resetBoard() {
      this.$socket.emit("resetGameRequest");
    },

    sendTaskId() {
      this.$socket.emit("echoTaskId", this.taskId);
    },

    showStats() {
      this.$socket.emit("showStats");
    }, 

    bootAll() {
      var con = confirm("This will end the session and boot all users! Are you sure?")
      if (con === true) {
        this.$socket.emit("bootAll");
      }
    },
  },
};
</script>