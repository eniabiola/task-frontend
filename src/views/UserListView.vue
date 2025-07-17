<template>
  <div class="container mt-4">
    <h2 class="mb-3">User Management</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else>
      <table class="table table-hover">
        <thead>
        <tr>
          <th @click="toggleSort('name')" style="cursor: pointer">
            Name
            <span v-if="sortBy === 'name'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
          </th>
          <th @click="toggleSort('email')" style="cursor: pointer">
            Email
            <span v-if="sortBy === 'email'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
          </th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select
              class="form-select form-select-sm"
              v-model="user.selectedRole"
            >
              <option
                v-for="role in roles"
                :key="role.name"
                :value="role.name"
              >
                {{ role.name }}
              </option>
            </select><!--
            <select
              class="form-select form-select-sm"
              v-model="user.selectedRole"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>-->
          </td>
          <td>

            <div class="d-flex gap-2">
              <button
                class="btn btn-sm btn-success me-2"
                @click="changeRole(user.id, user.selectedRole)"
              >
                Change Role
              </button>
              <button
                class="btn btn-sm btn-primary"
                @click="goToUserTasks(user.id)"
              >
                View Tasks
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li
            class="page-item"
            :class="{ disabled: pagination.current_page === 1 }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(pagination.current_page - 1)"
            >
              Previous
            </a>
          </li>

          <li
            class="page-item"
            v-for="page in pagination.last_page"
            :key="page"
            :class="{ active: pagination.current_page === page }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(page)"
            >
              {{ page }}
            </a>
          </li>

          <li
            class="page-item"
            :class="{ disabled: pagination.current_page === pagination.last_page }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(pagination.current_page + 1)"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/services/axios'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const users = ref([])
const roles = ref([])

const loading = ref(false)
const sortBy = ref('name')
const sortOrder = ref('asc')
const pagination = ref({ current_page: 1, last_page: 1 })

// Fetch users
const fetchUsers = async (page = 1) => {
  loading.value = true
  try {
    const { data } = await axios.get('/users', {
      params: {
        page,
        sort_by: sortBy.value,
        order: sortOrder.value,
      },
    })

    users.value = data.data.data.map((user) => ({
      ...user,
      selectedRole: user.role,
    }))

    const meta = data.data.meta
    pagination.value.current_page = meta.current_page
    pagination.value.last_page = meta.last_page
  } catch (error) {
    toast.error('Failed to load users')
  } finally {
    loading.value = false
  }
}

// Change user role only
const changeRole = async (userId, newRole) => {
  try {
    await axios.patch(`/users/${userId}/role`, { role_id: newRole })
    toast.success('Role updated successfully')
    await fetchUsers(pagination.value.current_page)
  } catch (error) {
    toast.error(error.response.data.message)
  }
}

// Navigate to user task page
const goToUserTasks = (userId) => {
  router.push(`/user/tasks/${userId}`)
}

// Change page
const changePage = (page) => {
  if (
    page > 0 &&
    page <= pagination.value.last_page &&
    page !== pagination.value.current_page
  ) {
    fetchUsers(page)
  }
}


const fetchRoles = async () => {
  try {
    const { data } = await axios.get('/roles')
    roles.value = data.data ?? data
  } catch (error) {
    toast.error('Failed to load roles')
  }
}

// Toggle sort
const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
  fetchUsers(pagination.value.current_page)
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>
