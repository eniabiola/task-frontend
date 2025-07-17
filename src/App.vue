<script setup>
import { RouterView } from 'vue-router'
import Sidebar from './components/SidebarTemplate.vue'
import { useAuthStore } from './stores/auth.js'
import { storeToRefs } from 'pinia'
import HeaderTemplate from '@/components/HeaderTemplate.vue'

const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)

</script>

<template>
  <div class="container-fluid">

    <HeaderTemplate />
    <div  v-if="isAuthenticated" class="row">
      <!-- Sidebar -->
      <div class="col-md-3 bg-light border-end min-vh-100 p-3">
        <Sidebar />
      </div>

      <!-- Main Content -->
      <div class="col-md-9 p-4">
        <main>
          <RouterView />
        </main>
      </div>
    </div>
    <div  v-if="!isAuthenticated">
      <!-- Main Content -->
        <main>
          <RouterView />
        </main>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  height: 100vh;
}
</style>
