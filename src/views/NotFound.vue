<template>
  <div class="grow grid place-content-center">
    <div class="text-center font-semibold">
      <h1 class="text-primary text-8xl mb-2">404</h1>
      <h2 class="text-2xl mb-3">Page not found!</h2>
      <a-button type="primary" @click.prevent="$router.push({name: 'credit'})">Back to home</a-button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
