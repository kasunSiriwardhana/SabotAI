import { createRouter, createWebHistory, RouterView } from 'vue-router';
import { nextTick } from 'vue';

import { getAuth } from 'firebase/auth';

const Dashboard = () => import('@/views/Dashboard.vue');
const Login = () => import('@/views/Login.vue');
const Settings = () => import('@/views/Settings.vue');

const CameraSummary = () => import('@/views/camera/Summary.vue');
const CameraObstruction = () => import('@/views/camera/Obstruction.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { layout: 'Sidebar', hideForAuth: false, requiresAuth: true, title: 'Map' },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { layout: 'Blank', hideForAuth: true, requiresAuth: false, title: 'Sign In' },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { layout: 'Sidebar', hideForAuth: false, requiresAuth: true, title: 'Settings' },
    },
    {
      path: '/camera',
      component: RouterView,
      meta: { layout: 'Sidebar', hideForAuth: false, requiresAuth: true },
      children: [
        {
          path: ':cameraId/summary',
          name: 'ViewCameraSummary',
          component: CameraSummary,
          meta: { title: 'Camera' },
        },
        {
          path: ':cameraId/obstruction/:obstructionId',
          name: 'ViewObstructionDetails',
          component: CameraObstruction,
          meta: { title: 'Issue' },
        },
      ],
    },
  ],
});

/* eslint-disable no-unused-vars */
router.beforeEach((to, from, next) => {
  const hideForAuth = to.matched.some((record) => record.meta.hideForAuth);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  const googleAuthInstance = getAuth();
  const isAuth = !!googleAuthInstance.currentUser;

  if (requiresAuth && !isAuth) {
    next({ name: 'Login' });
    return;
  }

  if (hideForAuth && isAuth) {
    next({ name: 'Dashboard' });
    return;
  }

  next();
});

router.afterEach((to, from) => {
  nextTick(() => {
    document.title = to.meta.title ? to.meta.title : 'SabotAI';
  });
});

export default router;
