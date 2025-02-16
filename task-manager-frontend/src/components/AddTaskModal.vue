<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="text-xl font-bold text-gray-800">Add New Task</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="submitTask" class="modal-body">
        <!-- General error message -->
        <div v-if="errors?.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-red-600 text-sm">{{ errors.general }}</p>
        </div>

        <div class="form-group">
          <label for="title">Title</label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Enter task title"
            required
            class="form-input"
            :class="{ 'border-red-500': errors?.title }"
          />
          <p v-if="errors?.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="description"
            placeholder="Enter task description"
            rows="3"
            class="form-input"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="due_date">Due Date</label>
            <input
              id="due_date"
              v-model="due_date"
              type="datetime-local"
              required
              class="form-input"
              :class="{ 'border-red-500': errors.due_date }"
            />
            <p v-if="errors.due_date" class="text-red-500 text-xs mt-1">{{ errors.due_date }}</p>
          </div>

          <div class="form-group">
            <label for="priority">Priority</label>
            <select id="priority" v-model="priority" class="form-input">
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({})
  }
});

import { useTaskStore } from '../stores/taskStore';

const emit = defineEmits(['close']);
const taskStore = useTaskStore();

const title = ref('');
const description = ref('');
const due_date = ref('');
const priority = ref('Medium');
const errorMessage = ref('');
const errors = ref({});

const submitTask = async () => {
    try {
        errorMessage.value = '';
        errors.value = {};

        await taskStore.addTask({
            title: title.value,
            description: description.value,
            due_date: due_date.value,
            priority: priority.value
        });

        title.value = '';
        description.value = '';
        due_date.value = '';
        priority.value = 'Medium';

        emit('close');
    } catch (error) {
        // console.log(error);
        
        if (error.response?.data?.errors) {
            // Handle validation errors
            errors.value = error.response.data.errors;
        } else {
            // Handle general error
            errorMessage.value = error.response?.data?.message || 'Failed to create task. Please try again.';
        }
    }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  ring: 2px;
  ring-color: #93c5fd;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.15s ease-in-out;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #9ca3af;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.15s ease-in-out;
}

.btn-secondary:hover {
  background-color: #6b7280;
}
</style>
