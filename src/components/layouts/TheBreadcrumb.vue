<template>
  <div class="grid grid-cols-[auto_auto_1fr] items-center gap-3 mb-3">
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" @click="goHome">
      <path
        d="M14.8534 8.12703L13.7824 7.05503L7.88235 1.15503C7.78184 1.05451 7.64551 0.998047 7.50335 0.998047C7.3612 0.998047 7.22487 1.05451 7.12435 1.15503L1.22435 7.05503L0.154354 8.12703C0.054994 8.22779 -0.000490646 8.36375 3.26951e-06 8.50525C0.000497185 8.64676 0.0569296 8.78233 0.156991 8.88239C0.257052 8.98245 0.392622 9.03889 0.534129 9.03938C0.675636 9.03987 0.811597 8.98439 0.912354 8.88503L1.06935 8.72703V15.476C1.06935 15.6182 1.12583 15.7545 1.22635 15.855C1.32686 15.9556 1.4632 16.012 1.60535 16.012H13.4054C13.5475 16.012 13.6838 15.9556 13.7844 15.855C13.8849 15.7545 13.9414 15.6182 13.9414 15.476V8.72803L14.0984 8.88503C14.1991 8.98439 14.3351 9.03987 14.4766 9.03938C14.6181 9.03889 14.7537 8.98245 14.8537 8.88239C14.9538 8.78233 15.0102 8.64676 15.0107 8.50525C15.0112 8.36375 14.9557 8.22779 14.8564 8.12703H14.8534ZM9.11235 14.94H5.89635V10.651H9.11235V14.94ZM12.8654 14.94H10.1854V10.115C10.1854 9.97287 10.1289 9.83654 10.0284 9.73602C9.92784 9.6355 9.79151 9.57903 9.64935 9.57903H5.35935C5.28897 9.57903 5.21927 9.59289 5.15424 9.61983C5.08921 9.64677 5.03012 9.68625 4.98035 9.73602C4.93057 9.78579 4.89109 9.84488 4.86415 9.90991C4.83722 9.97494 4.82335 10.0446 4.82335 10.115V14.94H2.14235V7.65603L7.50435 2.29303L12.8664 7.65603L12.8654 14.94Z"
        fill="#2979FF"
      />
    </svg>
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.32227 0.998108L7.00626 2.6821L8.69028 4.3661L7.00626 6.05011L5.32227 7.73511"
        stroke="#626262"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.32227 0.998108L3.00626 2.6821L4.69028 4.3661L3.00626 6.05011L1.32227 7.73511"
        stroke="#626262"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <a-breadcrumb>
      <a-breadcrumb-item class="text-secondary" @click="goHome">Rapid Connect</a-breadcrumb-item>
      <a-breadcrumb-item class="capitalize !text-primary font-semibold">{{
          (route.name as any)?.split('-').join(' ')
        }}
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';

const router = useRouter();
const route = useRoute();

const goHome = () => {
  router.push({
    name: 'home',
  });
};
</script>

<style scoped></style>
