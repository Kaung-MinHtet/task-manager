<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold">Task Manager</router-link>

      <div class="space-x-4 flex items-center">
        <router-link to="/" class="hover:underline hidden md:inline">Home</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/tasks" class="hover:underline">Tasks</router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="hover:underline">Login</router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/register" class="hover:underline">Register</router-link>
        
        <!-- Logout Button -->
        <button v-if="authStore.isAuthenticated" @click="logout" class="bg-red-500 px-4 py-1 rounded-md hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <router-view />
    </main>

  
  </div>
</template>

<script>
import { useAuthStore } from "./stores/auth";

export default {
  setup() {
    const authStore = useAuthStore();

    const logout = async () => {
      await authStore.logout();
    };

    return { authStore, logout };
  },
};
</script>

