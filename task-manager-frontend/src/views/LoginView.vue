<template>
    <div class="flex justify-center items-center h-screen">
      <div class="w-full max-w-md bg-white shadow-lg p-6 rounded-md">
        <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block font-semibold">Email</label>
            <input type="email" v-model="email" class="w-full p-2 border rounded-md" required />
          </div>
          
          <div class="mb-4">
            <label class="block font-semibold">Password</label>
            <input type="password" v-model="password" class="w-full p-2 border rounded-md" required />
          </div>
  
          <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Login
          </button>
  
          <p v-if="errorMessage" class="text-red-500 mt-2 text-center">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from "../stores/auth";
  import { useRouter } from "vue-router";
  import { ref } from "vue";
  
  export default {
    setup() {
      const email = ref("");
      const password = ref("");
      const errorMessage = ref("");
      const authStore = useAuthStore();
      const router = useRouter();
  
      const handleLogin = async () => {
        try {
          await authStore.login({ email: email.value, password: password.value });
          router.push("/tasks"); // ✅ Redirect to tasks after login
        } catch (error) {
          errorMessage.value = error.message;
        }
      };
  
      return { email, password, handleLogin, errorMessage };
    },
  };
  </script>
  