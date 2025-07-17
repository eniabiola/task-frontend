<template>
  <div class="mt-5">
    <div class="card my-5">
    <form @submit.prevent="createTask" class="m-3">
      <div class="row mb-2">
        <div class="col">
          <input v-model="newTask.title" type="text" placeholder="Title" class="form-control">
          <p v-for="(msg, i) in fieldErrors.title" :key="i" class="error">{{ msg }}</p>
        </div>
        <div class="col">
          <input v-model="newTask.due_date" type="datetime-local" class="form-control">
          <p v-for="(msg, i) in fieldErrors.due_date" :key="i" class="error">{{ msg }}</p>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col">
          <textarea v-model="newTask.description" placeholder="Description" class="form-control" />
          <p v-for="(msg, i) in fieldErrors.description" :key="i" class="error">{{ msg }}</p>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Add Task</button>
    </form>
    </div>


    <div class="table-responsive">

      <!-- Loading -->
      <div v-if="loading" class="text-center my-4">Loading tasks...</div>

      <!-- Task Table -->
      <table v-else class="table">
        <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2 text-left">Title</th>
          <th class="border px-4 py-2 text-left">Description</th>
          <th @click="toggleSort('task_status_id')" class="border px-4 py-2 text-left">
            Status
            <span v-if="sortBy === 'task_status_id'">
              <i :class="sortOrder === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
            </span>
          </th>
          <th @click="toggleSort('due_date')" class="border px-4 py-2 text-left">
            Due Date
            <span v-if="sortBy === 'due_date'">
              <i :class="sortOrder === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
            </span>
          </th>
          <th @click="toggleSort('created_at')" class="border px-4 py-2 text-left">
            Created At
            <span v-if="sortBy === 'created_at'">
              <i :class="sortOrder === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
            </span>
          </th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-50">
          <td class="border px-4 py-2">{{ task.title }}</td>
          <td class="border px-4 py-2">{{ task.description || '—' }}</td>
          <td class="border px-4 py-2">
            <div class="flex items-center gap-2">
              <span :class="task.status_badge_colour">
              {{ task.status }}
              </span>
            </div>
          </td>
          <td class="border px-4 py-2">{{ task.due_date }}</td>
          <td class="border px-4 py-2">{{ task.created_at }}</td>
          <td>
            <div class="d-flex gap-2">
              <router-link :to="`/tasks/${task.id}`" class="btn btn-primary btn-sm">
                View
              </router-link>
              <button @click="deleteTask(task.id)" class="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          </td>

        </tr>
        </tbody>
      </table>
    </div>

    <nav aria-label="Task pagination" class="mt-4">
      <ul class="pagination justify-content-center">

        <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
          <button
            class="page-link"
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
          >
            Previous
          </button>
        </li>

        <li class="page-item disabled">
      <span class="page-link">
        Page {{ pagination.current_page }} of {{ pagination.last_page }}
      </span>
        </li>

        <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
          <button
            class="page-link"
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
          >
            Next
          </button>
        </li>

      </ul>
    </nav>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/services/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

// Data
const tasks = ref([])
const statuses = ref([])
const loading = ref(false)
const fieldErrors = ref({});
const generalError = ref('');

const sortBy = ref('due_date')
const sortOrder = ref('asc')

const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc' // reset to ascending
  }
  fetchTasks(pagination.value.current_page)
}


const pagination = ref({ current_page: 1, last_page: 1 })

// New task form data
const newTask = ref({
  title: '',
  description: '',
  due_date: '',
  task_status_id: ''
})

// Fetch tasks
const fetchTasks = async (page = 1) => {
  loading.value = true
  try {
    const response = await axios.get(`/tasks`, {
      params: {
        page,
        sort_by: sortBy.value,
        order: sortOrder.value
      }
    })
    tasks.value = response.data.data.data
    const meta = response.data.data.meta
    pagination.value.current_page = meta.current_page
    pagination.value.last_page = meta.last_page
  } catch (err) {
    toast.error('Failed to load tasks')
  } finally {
    loading.value = false
  }
}

// Create new task
const createTask = async () => {
  try {
    const response = await axios.post('/tasks', newTask.value)
    toast.success('Task created successfully')
    newTask.value = { title: '', description: '', due_date: '', task_status_id: '' }
    fieldErrors.value = {};
    await fetchTasks(pagination.value.current_page)
  } catch (err) {

    const errorData = err.response?.data || {};
    // Set specific field errors and a general message
    fieldErrors.value = errorData.errors || {};
    generalError.value = errorData.message || 'Unable to create task';
    toast.error(generalError.value)
  }
}


// Delete task
const deleteTask = async (taskId) => {
  if (!confirm('Are you sure you want to delete this task?')) return
  try {
    await axios.delete(`/tasks/${taskId}`)
    toast.success('Task deleted')
    await fetchTasks(pagination.value.current_page)
  } catch (err) {
    toast.error('Failed to delete task')
  }
}

const fetchStatuses = async () => {
  try {
    const res = await axios.get('/task-statuses')
    statuses.value = res.data.data
  } catch (error) {
    //do something with the error
  }
}

// Pagination
const changePage = (page) => {
  if (page !== pagination.value.current_page && page > 0 && page <= pagination.value.last_page) {
    fetchTasks(page)
  }
}

onMounted(async () => {
  await fetchTasks()
  await fetchStatuses()
})
</script>
