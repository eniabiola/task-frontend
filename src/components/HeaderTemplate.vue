<template>
  <header>
    <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
      <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
        <span class="fs-4">Tasks Assessment</span>
      </a>

      <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="me-3 py-2 text-dark text-decoration-none"
        >Login</router-link>

        <router-link
          v-if="!isAuthenticated"
          to="/register"
          class="me-3 py-2 text-dark text-decoration-none"
        >Register</router-link>

        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="btn btn-link py-2 text-dark text-decoration-none"
        >Logout</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { watch } from 'vue'

const auth = useAuthStore();
const router = useRouter();
const {isAuthenticated} = storeToRefs(auth);

const handleLogout = async () => {
  auth.logout();
  await router.push('/login');
};

watch(isAuthenticated, (val) => {
  //console.log('Header: isAuthenticated changed:', val)
})
</script>
