import { defineStore } from 'pinia';
import api from '../api';
import { useAuthStore } from './auth';

api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        tasks: [],
        errorMessage: '',
    }),

    actions: {
        async fetchTasks() {
            try {
                const response = await api.get('/tasks');
                this.tasks = response.data;
            } catch (error) {
                this.errorMessage = error.response.data.message;
            }
        },

        async addTask(task) {
            try {
                await api.post('/tasks', task);
                await this.fetchTasks();
            } catch (error) {
                this.errorMessage = error.response.data.message;
            }
        },

        async updateTask(task) {
            try {
                await api.put(`/tasks/${task.id}`, task);
                await this.fetchTasks();
            } catch (error) {
                this.errorMessage = error.response.data.message;
            }
        },

        async deleteTask(taskId) {
            try {
                await api.delete(`/tasks/${taskId}`);
                await this.fetchTasks();
            } catch (error) {
                this.errorMessage = error.response.data.message;
            }
        },

        async toggleTask(taskId) {
            try {
                await api.patch(`/tasks/${taskId}/toggle`);
                await this.fetchTasks();
            } catch (error) {
                this.errorMessage = error.response.data.message;
            }
        },
    }
});
