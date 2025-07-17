
<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Task Dashboard</h1>
    <TaskForm @add-task="addTask" />
    <TaskList :tasks="tasks" />
    <button class="btn mt-4" @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const tasks = ref([]);
const addTask = (task) => tasks.value.push(task);
const auth = useAuthStore();
const logout = () => auth.logout();
</script>
