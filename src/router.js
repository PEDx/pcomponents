import App from './App';

export default [
  {
    path: '/',
    redirect: {
      name: 'index',
    },
  },
  {
    path: '/index',
    name: 'index',
    component: App,
    children: [
    ],
  },
];
