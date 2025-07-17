<template>
  <div class="register-container d-flex justify-content-center align-items-center">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h3 class="text-center mb-4">Register</h3>
      <form @submit.prevent="handleRegister" role="form" data-testid="register-form">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input v-model="name" id="name" type="text" class="form-control" placeholder="Your name" />
          <div v-for="(msg, i) in fieldErrors.name" :key="i" class="text-danger small">{{ msg }}</div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email Address</label>
          <input v-model="email" id="email" type="email" class="form-control" placeholder="name@example.com" />
          <div v-for="(msg, i) in fieldErrors.email" :key="i" class="text-danger small">{{ msg }}</div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" id="password" type="password" class="form-control" placeholder="Password" />
          <div v-for="(msg, i) in fieldErrors.password" :key="i" class="text-danger small">{{ msg }}</div>
        </div>

        <div class="mb-3">
          <label for="password_confirmation" class="form-label">Confirm Password</label>
          <input v-model="password_confirmation" id="password_confirmation" type="password" class="form-control" placeholder="Confirm Password" />
          <div v-if="passwordMismatch" class="text-danger small">Passwords don't match</div>
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>

        <p v-if="generalError" class="text-danger text-center mt-3">{{ generalError }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const generalError = ref('');
const fieldErrors = ref({});
const loading = ref(false);
const auth = useAuthStore();

const passwordMismatch = computed(() =>
  password.value && password_confirmation.value && password.value !== password_confirmation.value
);

const handleRegister = async () => {
  generalError.value = '';
  fieldErrors.value = {};

  if (passwordMismatch.value) return;

  loading.value = true;
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
  } catch (errorData) {
    fieldErrors.value = errorData.errors || {};
    generalError.value = 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/*.register-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}*/
</style>
