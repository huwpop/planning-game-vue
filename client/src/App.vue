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
      <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#"
          >Planning Game</a
        >
        <ul class="navbar-nav px-3">
          <li class="nav-item text-nowrap">
            <a v-on:click="showEstimates" class="nav-link btn btn-dark" href="#">Results</a>
          </li>
        </ul>
        <input
          class="form-control form-control-dark w-100"
          type="text"
          placeholder="Task ID / Description"
          aria-label="Task ID / Description"
          v-model="taskId"
          v-on:keyup.enter="sendTaskId" 
          v-on:keydown="sendTaskId"
        />
        <ul class="navbar-nav px-3">
          <li class="nav-item text-nowrap">
            <a v-on:click="resetBoard" class="nav-link" href="#">Reset</a>
          </li>
        </ul>
      </nav>
      <div class="container-fluid">
        <div class="row">
          <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
              <ul class="nav flex-column">
                <li
                  class="nav-item"
                  v-for="(userObj, userId) in users"
                  :key="userId"
                >
                  <span class="nav-link col-12" :id="'user-' + userId">
                    {{ userObj.username }} 
                    <span class="text-right" v-if="userObj.voted"> Voted</span>
                  </span>
                  
                </li>
              </ul>
            </div>
          </nav>

          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div
              class="d-flex justify-content-around flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
            >
              <div v-for="(card, i) in cardsInPlay" :key="i" class="card text-white bg-dark" style="max-width: 10rem" >
                <div v-if="Array.isArray(cardsInPlay)" class="card-header text-center h2">?</div>
                <div v-else class="card-header text-center h2">{{ cardsInPlay[i] }}</div>
                <div class="card-body">
                  <!-- <h5 class="card-title">{{ users[card].username }}</h5> -->
                  <p v-if="Array.isArray(cardsInPlay)" class="card-text text-white text-center">
                    {{ users[card].username }}
                  </p>
                  <p v-else class="card-text text-white text-center">
                    {{ users[i].username }}
                  </p>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
      <!-- <div class="card-header text-white">
          <h4>
            My Chat App
            <span class="float-right">{{ connections }} connections</span>
          </h4>
        </div>
        <ul class="list-group list-group-flush text-right">
          <small v-if="typing" class="text-white">{{ typing }} is typing</small>
          <li
            class="list-group-item"
            v-for="message in messages"
            :key="message.id"
          >
            <span :class="{ 'float-left': message.type === 1 }">
              {{ message.message }}
              <small>:{{ message.user }}</small>
            </span>
          </li>
        </ul>

        <div class="card-body">
          <form @submit.prevent="send">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="newMessage"
                placeholder="Enter message here"
              />
            </div>
          </form>
        </div> -->
      <nav class="navbar fixed-bottom navbar-expand-sm navbar-dark bg-dark">
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav col-12 row px-0 mx-0 d-flex justify-content-around">
            <div
              class="nav-item col"
              v-for="estimate in allowedEsimates"
              :key="estimate"
            >
              <input class="d-none" :id="estimate + '-label'" type="radio" :value="estimate" v-on:click="submitEstimate(estimate)"/>
                <!-- {{ estimate }}
              </input> -->
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
      //userEstimate: undefined,
      cardsInPlay: [],
      taskId: null,

      //newMessage: null,
      //messages: [],
      //typing: false,
      username: null,
      ready: false,
      //info: [],
      connections: 0,
    };
  },

  created() {
    window.onbeforeunload = function () {
      this.$socket.emit("leave", this.username);
    };
  },

  sockets: {

    connections: function (data) {
      this.connections = data;
    },

    allowedEsimates: function (data) {
      this.allowedEsimates = data;
    },

    userPool: function (data) {
      console.log(data);
      this.users = data;
    },

    updateBored: function (data) {
      this.cardsInPlay = data.estimates;
      this.users = data.users;
    },

    displayEstimates: function (data) {
      this.cardsInPlay = data.estimates;
    },

    resetGame: function(data) { //TODO duplicate of update board 
      this.cardsInPlay = data.estimates;
      this.users = data.users;
      this.taskId = null;
    },

    updateTaskId: function(data) {
      this.taskId = data
    }

  },

  watch: {
    newMessage(value) {
      value
        ? this.$socket.emit("typing", this.username)
        : this.$socket.emit("stopTyping");
    },
  },

  methods: {
    send() {
      this.messages.push({
        message: this.newMessage,
        type: 0,
        user: "Me",
      });

      this.$socket.emit("chat-message", {
        message: this.newMessage,
        user: this.username,
      });
      this.newMessage = null;
    },

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
    }
  },
};
</script>