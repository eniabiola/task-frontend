<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h3 class="text-center mb-4">Please sign in</h3>

      <form @submit.prevent="handleLogin">
        <div class="form-floating mb-3">
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            required
          />
          <label for="floatingInput">Email address</label>
        </div>

        <div class="form-floating mb-3">
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            required
          />
          <label for="floatingPassword">Password</label>
        </div>

        <button class="btn btn-primary w-100" :disabled="loading" type="submit">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const toast = useToast();
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    toast.success("Logged in successfully");
    router.push({ name: 'Tasks' });
  } catch (err) {
    error.value = err.message || 'Invalid email or password';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (auth.isAuthenticated) {
    router.push({ name: 'Tasks' });
  }
});
</script>

<style scoped>
/*.login-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}*/
</style>
