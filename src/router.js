import Login from './pages/login';
import Form from './pages/form';
import Status from './pages/status';
import App from './App';

export default [
  {
    path: '/',
    redirect: {
      name: 'login',
    },
  },
  {
    path: '/index',
    name: 'index',
    component: App,
    children: [
      {
        path: '/login',
        name: 'login',
        component: Login,
      },
      {
        path: '/form',
        name: 'form',
        component: Form,
      },
      {
        path: '/form/status',
        name: 'status',
        component: Status,
      },

    ],
  },
];
