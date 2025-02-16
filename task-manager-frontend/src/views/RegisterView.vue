<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">Create an Account</h2>
  
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-gray-600">Full Name</label>
            <input v-model="name" type="text" required placeholder="Enter your name"
                   class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"/>
          </div>
  
          <!-- Email -->
          <div>
            <label class="block text-gray-600">Email</label>
            <input v-model="email" type="email" required placeholder="Enter your email"
                   class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"/>
          </div>
  
          <!-- Password -->
          <div>
            <label class="block text-gray-600">Password</label>
            <input v-model="password" type="password" required placeholder="Create a password"
                   class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"/>
          </div>
  
          <!-- Confirm Password -->
          <div>
            <label class="block text-gray-600">Confirm Password</label>
            <input v-model="passwordConfirm" type="password" required placeholder="Confirm your password"
                   class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"/>
          </div>
  
          <!-- Submit Button -->
          <button type="submit"
                  class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            Register
          </button>
  
          <!-- Error Message -->
          <p v-if="errorMessage" class="text-red-500 text-center mt-2">{{ errorMessage }}</p>
        </form>
  
        <!-- Login Link -->
        <p class="text-center text-gray-600 mt-4">
          Already have an account?
          <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useAuthStore } from "../stores/auth";
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const name = ref("");
      const email = ref("");
      const password = ref("");
      const passwordConfirm = ref("");
      const errorMessage = ref("");
  
      const handleRegister = async () => {
        if (password.value !== passwordConfirm.value) {
          errorMessage.value = "Passwords do not match!";
          return;
        }
        try {
          await authStore.register({ name: name.value, email: email.value, password: password.value });
        } catch (error) {
          errorMessage.value = "Registration failed! Try again.";
        }
      };
  
      return { name, email, password, passwordConfirm, handleRegister, errorMessage };
    },
  };
  </script>
  