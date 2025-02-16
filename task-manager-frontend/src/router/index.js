import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import TaskListView from '../views/TaskListView.vue';
// import NotFoundView from '../views/NotFoundView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
    { path: "/", component: HomeView },
    { path: "/login", component: LoginView },
    { path: "/register", component: RegisterView },
    { 
      path: "/tasks", 
      component: TaskListView, 
      meta: { requiresAuth: true } // 🔒 Require authentication
    },
    // { path: "/:pathMatch(.*)*", component: NotFoundView },
  ];
const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.token) {
        next('/login');
    } else {
        next();
    }
});


export default router;
