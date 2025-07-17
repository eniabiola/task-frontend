<template>
  <div v-if="task" class="p-4">
    <h6 class="text-xl font-bold mb-4"><strong>Title: &nbsp;&nbsp;</strong> {{ task.title }}</h6>

    <div class="mb-2">
      <strong>Description: &nbsp;&nbsp;</strong> {{ task.description || 'No description' }}
    </div>

    <div class="mb-2"><strong>Due Date:</strong> {{ task.due_date }}</div>

    <div class="mb-2">
      <strong>Status:</strong><span :class="task.status_badge_colour || ''">
        {{ task.status || 'Unknown' }}
      </span>
    </div>

    <div class="card my-4">
      <div class="card-body">
        <h5 class="card-title">Change Task Status</h5>
        <form @submit.prevent="updateStatus">
          <div class="mb-3">
            <label for="statusSelect" class="form-label">New Status</label>
            <select
              id="statusSelect"
              v-model="selectedStatusId"
              class="form-select"
            >
              <option v-for="status in statusList" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="status_comment" class="form-label">Comment</label>
            <textarea
              id="status_comment"
              v-model="status_comment"
              class="form-control"
              placeholder="Add a comment explaining the status change"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary">Update Status</button>
        </form>
      </div>
    </div>


    <router-link to="/tasks" class="text-blue-600 mt-4 inline-block">← Back to Tasks</router-link>
  </div>

  <h3 class="mt-4">Status Change History</h3>
  <table class="table table-bordered">
    <thead>
    <tr>
      <th>Old Status</th>
      <th>New Status</th>
      <th>Changed By</th>
      <th>Comment</th>
      <th>Changed At</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(history, index) in statusHistory.data" :key="index">
      <td>{{ history.old_status_name }}</td>
      <td>{{ history.new_status_name }}</td>
      <td>{{ history.status_change_by }}</td>
      <td>{{ history.comment }}</td>
      <td>{{ new Date(history.changed_at).toLocaleString() }}</td>
    </tr>
    </tbody>
  </table>

  <nav v-if="statusHistory.meta.total > 0" aria-label="Status history pagination" class="mt-4">
    <ul class="pagination justify-content-center">

      <li class="page-item" :class="{ disabled: statusHistory.meta.current_page === 1 }">
        <button
          type="button"
          class="page-link"
          @click="changePage(statusHistory.meta.current_page - 1)"
          :disabled="statusHistory.meta.current_page === 1"
        >
          Previous
        </button>
      </li>

      <li class="page-item disabled">
      <span class="page-link">
        Page {{ statusHistory.meta.current_page }} of {{ statusHistory.meta.last_page }}
      </span>
      </li>

      <li class="page-item" :class="{ disabled: statusHistory.meta.current_page === statusHistory.meta.last_page }">
        <button
          type="button"
          class="page-link"
          @click="changePage(statusHistory.meta.current_page + 1)"
          :disabled="statusHistory.meta.current_page === statusHistory.meta.last_page"
        >
          Next
        </button>
      </li>

    </ul>
  </nav>


  <div v-else class="text-center text-gray-500 mt-4">Loading task details...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '../services/axios'
import { useToast } from 'vue-toastification'

const route = useRoute()
const task = ref(null)
const selectedStatusId = ref('')
const status_comment = ref('')
const statusList = ref([])
const statusHistory = ref({ data: [], meta: {} })
const toast = useToast()

// Fetch Task Details
const fetchTask = async () => {
  try {
    const res = await axios.get(`/tasks/${route.params.id}`)
    task.value = res.data.data
    selectedStatusId.value = task.value.task_status_id
    fetchStatusHistory()  // Fetch the status history when task details are loaded
  } catch (err) {
    //
  }
}

//task statuses
const fetchStatuses = async () => {
  try {
    const res = await axios.get('/task-statuses')
    statusList.value = res.data.data
  } catch (err) {
    //
  }
}

// Fetch Status Change History (paginated)
const fetchStatusHistory = async (page = 1) => {
  try {
    const res = await axios.get(`/task-status-histories/${route.params.id}?page=${page}`)
    statusHistory.value = res.data.data
  } catch (err) {
    //
  }
}

// Update Task Status
const updateStatus = async () => {
  if (!task.value || !task.value.id) {
    toast.error('Task not loaded yet.')
    return
  }
  try {
    const res = await axios.patch(`/tasks/${task.value.id}/status`, {
      task_status_id: selectedStatusId.value,
      status_comment:  status_comment.value
    })
    task.value.task_status_id = selectedStatusId.value
    task.value.status = res.data.data.status
    toast.success('Status updated')
    status_comment.value = ""
    fetchStatusHistory()  // Re-fetch status history after updating status
  } catch (err) {
    toast.error(err.response?.data?.message ?? "Failed to Update Task Status")
  }
}

// Change Page in Pagination
const changePage = (url) => {
  if (!url) return
  const page = new URL(url).searchParams.get('page')
  fetchStatusHistory(page)  // Fetch status history for the selected page
}

// On Mounted
onMounted(() => {
  fetchTask()
  fetchStatuses()
})
</script>

<style scoped>
/* Add custom styling as needed */
</style>
