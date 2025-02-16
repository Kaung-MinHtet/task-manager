<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-100 to-blue-100 flex justify-center p-6">
    <div class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
      <!-- Header -->
      <div class="flex justify-between items-center border-b pb-4">
        <h1 class="text-3xl font-bold text-gray-700">Task Manager</h1>
        <!-- <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow">
          Logout
        </button> -->
      </div>

      <!-- Filters & Sorting -->
      <div class="flex flex-col md:flex-row gap-y-4 justify-between md:items-center mt-6 md:space-x-2">
        <select v-model="filterStatus" class="border p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-300">
          <option value="">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="complete">Completed</option>
        </select>

        <select v-model="sortBy" class="border p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-300">
          <option value="due_date">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>

        <button @click="openTaskForm" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow">
          + New Task
        </button>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>

      <!-- Task List -->
      <div class="mt-6 space-y-4">
        <p v-if="filteredTasks.length === 0" class="text-gray-500 text-center">No tasks available</p>

        <div v-for="task in filteredTasks" :key="task.id"
          class="p-4 border rounded-md shadow-md flex flex-col md:flex-row gap-y-4 justify-between md:items-center transition hover:shadow-lg"
          :class="getStatusClass(task.is_completed)">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ task.title }}</h3>
            <p class="text-sm text-gray-600">{{ task.description }}</p>
            <p class="text-sm mt-1">
              <span class="font-semibold">Due:</span> {{ task.due_date }}
            </p>
            <span class="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded"
              :class="getPriorityColor(task.priority)">
              {{ task.priority }}
            </span>
          </div>

          <div class="flex space-x-2">
            <button @click="toggleTaskStatus(task)" class="px-4 py-2 rounded-md text-white font-semibold"
              :class="task.is_completed ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'">
              {{ task.is_completed ? 'Undo' : 'Complete' }}
            </button>
            <button @click="deleteTask(task.id)" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">
              Delete
            </button>
          </div>
        </div>
      </div>

    </div>
    
    <!-- Add this near the end of template, before the closing div -->
    <AddTaskModal 
      v-if="showTaskForm" 
      @close="closeTaskForm"
      @submit="handleTaskSubmit"
    />
  </div>
</template>

<script>
import { useTaskStore } from '../stores/taskStore';
import { useAuthStore } from "../stores/auth";
import { computed, onMounted, ref } from 'vue';
import AddTaskModal from '../components/AddTaskModal.vue';  // Add this import

export default {
  components: {
    AddTaskModal
  },
  setup() {
    const taskStore = useTaskStore();
    const authStore = useAuthStore();
    const showTaskForm = ref(false);  // Add this

    const filterStatus = ref('');
    const sortBy = ref('due_date');

    const filteredTasks = computed(() => {
      let filtered = taskStore.tasks;
      if (filterStatus.value) {
        // console.log(filtered);
        filtered = filtered.filter(task => task.is_completed == (filterStatus.value === "complete"));
        // console.log(filtered);
        
      }
      return filtered.sort((a, b) =>
        sortBy.value === 'due_date'
          ? new Date(a.due_date) - new Date(b.due_date)
          : a.priority.localeCompare(b.priority)
      );
    });

    const getPriorityColor = (priority) => {
      return {
        Low: 'bg-green-100 text-green-700',
        Medium: 'bg-yellow-100 text-yellow-700',
        High: 'bg-red-100 text-red-700',
      }[priority] || 'bg-gray-100 text-gray-700';
    };

    const getStatusClass = (status) => {
      return status ? 'bg-green-100 border-green-400 opacity-80' : 'bg-yellow-100 border-yellow-400';
    };

    onMounted(() => {
      taskStore.fetchTasks();
    });

    const openTaskForm = () => {
      showTaskForm.value = true;
    };

    const closeTaskForm = () => {
      showTaskForm.value = false;
    };

    const toggleTaskStatus = async (task) => {
      try {
        const updatedTask = {
          ...task,
          status: task.is_completed ? 'pending' : 'complete'
        };
        await taskStore.toggleTask(task.id);
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    };

    const deleteTask = async (taskId) => {
      try {
        if (confirm('Are you sure you want to delete this task?')) {
          await taskStore.deleteTask(taskId);
        }
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    };

    const handleTaskSubmit = async (taskData) => {
      try {
        // await taskStore.addTask(taskData);
        closeTaskForm();
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    };

    return {
      filterStatus,
      sortBy,
      filteredTasks,
      errorMessage: computed(() => taskStore.errorMessage),
      getPriorityColor,
      getStatusClass,
      showTaskForm,
      openTaskForm,
      closeTaskForm,
      handleTaskSubmit,
      toggleTaskStatus,
      deleteTask,
    };
  },
};
</script>