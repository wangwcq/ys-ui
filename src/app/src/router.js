import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import App from './views/App.vue';
import Project from './views/Project/Project';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'app',
      component: App,
      children: [
        {
          path: 'today',
          name: 'Today',
          component: () => import('./views/Today/Today'),
        },
        {
          path: 'questions',
          name: 'Questions',
          component: () => import('./views/Questions/Questions'),
        },
        {
          path: 'project/:projectCode',
          name: 'ProjectHome',
          component: Project,
        },
        {
          path: 'old',
          name: 'Old',
          component: () => import('./views/Home.vue'),
        },
      ],
    },
  ],
});
