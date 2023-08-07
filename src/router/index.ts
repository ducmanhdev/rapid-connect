import {createRouter, createWebHistory, RouterView} from 'vue-router';
import {usePaymentStore} from '@/stores/payment';
import {useNumpadStore} from '@/stores/numpad';
import {useGeneralStore} from '@/stores/general';
import {useUserStore} from '@/stores/user';

const creditRoutes = [
  {
    path: '',
    name: 'credit',
    component: () => import('@/views/credit/Credit.vue'),
  },
  {
    path: 'reports',
    name: 'credit-reports',
    component: () => import('@/views/credit/Reports.vue'),
  },
  {
    path: 'sale',
    name: 'credit-sale-index',
    component: RouterView,
    redirect: {
      name: 'credit-sale',
    },
    children: [
      {
        path: '',
        name: 'credit-sale',
        component: () => import('@/views/credit/sale/Sale.vue'),
      },
      {
        path: 'tip',
        name: 'credit-sale-tip',
        component: () => import('@/views/credit/sale/Tip.vue'),
      },
      {
        path: 'custom-tip',
        name: 'credit-sale-custom-tip',
        component: () => import('@/views/credit/sale/CustomTip.vue'),
      },
      {
        path: 'tip-payment',
        name: 'credit-sale-tip-payment',
        component: () => import('@/views/credit/sale/TipPayment.vue'),
      },
      {
        path: 'tip-payment-signature/:referenceNumber',
        name: 'credit-sale-tip-payment-signature',
        component: () => import('@/views/credit/sale/TipPaymentSignature.vue'),
      },
    ],
  },
  {
    path: 'sale',
    name: 'credit-refund',
    component: () => import('@/views/credit/Refund.vue'),
  },
  {
    path: 'history',
    name: 'credit-history',
    redirect: {
      name: 'credit-history-list',
    },
    component: RouterView,
    children: [
      {
        path: 'list/:batchTimestamp?',
        name: 'credit-history-list',
        component: () => import('@/views/credit/history/List.vue'),
      },
      {
        path: 'detail/:referenceNumber/:batchTimestamp?',
        name: 'credit-history-detail',
        component: () => import('@/views/credit/history/Detail.vue'),
      },
      {
        path: 'detail/:referenceNumber/edit-tip',
        name: 'credit-history-detail-edit-tip',
        component: () => import('@/views/credit/history/DetailEditTip.vue'),
      },
      {
        path: 'receipt/:referenceNumber/:batchTimestamp?',
        name: 'credit-history-detail-receipt',
        component: () => import('@/views/credit/history/Receipt.vue'),
      },
    ],
  },
];
const settingsRoutes = [
  {
    path: '',
    name: 'settings',
    component: () => import('@/views/settings/Settings.vue'),
  },
  {
    path: 'business-information',
    name: 'settings-business-information',
    component: () => import('@/views/settings/BusinessInformation.vue'),
  },
  {
    path: 'devices',
    name: 'settings-devices',
    component: () => import('@/views/settings/Devices.vue'),
  },
  // {
  //   path: 'orders',
  //   name: 'settings-orders',
  //   component: () => import('@/views/settings/Orders.vue'),
  // },
  // {
  //   path: 'orders-receipts',
  //   name: 'settings-orders-receipts',
  //   component: () => import('@/views/settings/OrdersReceipts.vue'),
  // },
  // {
  //   path: 'payment',
  //   name: 'settings-payment',
  //   component: () => import('@/views/settings/Payment.vue'),
  // },
  // {
  //   path: 'payment-receipts',
  //   name: 'settings-payment-receipts',
  //   component: () => import('@/views/settings/PaymentReceipts.vue'),
  // },
  // {
  //   path: 'additional-charges',
  //   name: 'settings-additional-charges',
  //   component: () => import('@/views/settings/AdditionalCharges.vue'),
  // },
  // {
  //   path: 'taxes-fees',
  //   name: 'settings-taxes-fees',
  //   component: () => import('@/views/settings/TaxesFees.vue'),
  // },
  {
    path: 'tips',
    name: 'settings-tips',
    component: () => import('@/views/settings/Tips.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {
        name: 'credit',
      },
    },
    {
      path: '/credit',
      name: 'credit-index',
      component: RouterView,
      redirect: creditRoutes[0],
      children: creditRoutes,
    },
    {
      path: '/settings',
      name: 'settings-index',
      component: RouterView,
      redirect: settingsRoutes[0],
      children: settingsRoutes,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
});

router.beforeEach((to) => {
  const userStore = useUserStore();
  const accessToken = localStorage.getItem('accessToken') || userStore.accessToken;
  if (!accessToken && to.name !== 'login') return {name: 'login'};
  if (accessToken && to.name === 'login') return {name: 'credit'};

  const guardRoutes = [
    'credit-sale-tip',
    'credit-sale-custom-tip',
    'credit-sale-tip-payment',
    'credit-sale-tip-payment-signature',
  ];

  const paymentStore = usePaymentStore();
  if (guardRoutes.includes(to.name as string) && !paymentStore.payValue) {
    return {
      name: 'credit',
    };
  }

  const numpadStore = useNumpadStore();
  if (numpadStore.isVisible) {
    numpadStore.handleHide();
  }

  const generalStore = useGeneralStore();
  if (generalStore.isAsideVisible) {
    generalStore.hideAside();
  }
});

export default router;
