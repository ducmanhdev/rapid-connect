<template>
  <section class="card grow px-8 py-10">
    <div
      class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[repeat(5,120px)] gap-4 md:gap-x-4 md:gap-y-14 justify-between text-center font-medium text-base md:text-lg"
    >
      <router-link :to="item.route" v-for="item in listMenu" :key="item.title" class="text-inherit leading-snug">
        <img :src="getImageUrl(item.icon)" alt="" class="block mx-auto mb-2" />
        <span>{{ item.title }}</span>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import {getImageUrl} from '@/utils/url';

const listMenu = [
  {
    icon: 'credit-icon-1.svg',
    title: 'Business Information',
    route: {
      name: 'settings-business-information',
    },
  },
  // {
  //   icon: 'credit-icon-2.svg',
  //   title: 'Online Ordering',
  //   route: {
  //     name: 'settings-business-information',
  //   },
  // },
  {
    icon: 'credit-icon-3.svg',
    title: 'Devices',
    route: {
      name: 'settings-devices',
    },
  },
  // {
  //   icon: 'credit-icon-4.svg',
  //   title: 'Orders',
  //   route: {
  //     name: 'settings-orders',
  //   },
  // },
  // {
  //   icon: 'credit-icon-5.svg',
  //   title: 'Orders Receipts',
  //   route: {
  //     name: 'settings-orders-receipts',
  //   },
  // },
  // {
  //   icon: 'credit-icon-6.svg',
  //   title: 'Payments',
  //   route: {
  //     name: 'settings-payment',
  //   },
  // },
  // {
  //   icon: 'credit-icon-1.svg',
  //   title: 'Payment Receipts',
  //   route: {
  //     name: 'settings-payment-receipts',
  //   },
  // },
  // {
  //   icon: 'credit-icon-2.svg',
  //   title: 'Additional Charges',
  //   route: {
  //     name: 'settings-additional-charges',
  //   },
  // },
  // {
  //   icon: 'credit-icon-3.svg',
  //   title: 'Taxes & Fees',
  //   route: {
  //     name: 'settings-taxes-fees',
  //   },
  // },
  {
    icon: 'credit-icon-4.svg',
    title: 'Tips',
    route: {
      name: 'settings-tips',
    },
  },
];
</script>

<style scoped></style>
