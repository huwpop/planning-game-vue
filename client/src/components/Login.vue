
<template>
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
      </template>