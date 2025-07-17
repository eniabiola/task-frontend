<template>
  <div class="d-flex flex-column p-3 bg-light" style="width: 250px; height: 100vh;">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
      <span class="fs-4">Dashboard</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link to="/" class="nav-link" active-class="active">Home</router-link>
      </li>
      <li>
        <router-link to="/tasks" class="nav-link" active-class="active">My Tasks</router-link>
      </li>
      <li>
        <router-link v-if="user?.role === 'admin'" to="/all-tasks" class="nav-link" active-class="active">All Tasks</router-link>
      </li>
      <li>
        <router-link v-if="user?.role === 'admin'" to="/users" class="nav-link" active-class="active">All Users</router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.nav-link.active {
  background-color: #0d6efd;
  color: white !important;
}
</style>
<script setup>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
</script>
