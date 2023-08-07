<template>
  <section class="card grow p-0">
    <div class="divide-y">
      <div class="grid grid-cols-[1fr_30px] gap-2 py-3.5 px-5 justify-items-center px-[30px] py-5">
        <router-link :to="{name: 'settings'}" type="button" class="flex items-center w-full text-inherit">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          Settings
        </router-link>
        <button type="button">
          <img src="@/assets/images/icon-refresh.svg" alt="" />
        </button>
      </div>
      <div class="divide-y divide-CE6 child:px-[30px] child:py-3.5">
        <div>
          <a-checkbox v-model:checked="value">Enable service charge</a-checkbox>
        </div>
        <div class="!pl-[62px]">
          <p class="mb-0">Service charge percentage</p>
          <p class="mb-0 text-C82">All modifiers</p>
        </div>
        <div class="!pl-[62px]">
          <p class="mb-0">Service charge name</p>
          <p class="mb-0 text-C82">Service charge</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const value = ref(true);
</script>

<style scoped></style>
