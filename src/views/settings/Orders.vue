<template>
  <section class="card grow p-0">
    <div class="divide-y">
      <div class="grid grid-cols-[1fr_30px] gap-2 justify-items-center px-[30px] py-5">
        <router-link :to="{name: 'settings'}" type="button" class="flex items-center w-full text-inherit">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          Settings
        </router-link>
        <button type="button">
          <img src="@/assets/images/icon-refresh.svg" alt="" />
        </button>
      </div>
      <a-checkbox-group
        class="w-full child:!mr-0 child:!flex divide-y child:!px-[30px] child:!py-4"
        name="orders"
        :options="options"
        v-model:value="value"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const value = ref([0]);
const options = [
  {label: 'Enable order notes', value: 0},
  {label: 'Remain in category after adding an item to an order', value: 1},
  {label: 'Group identical items into one line', value: 2},
];
</script>

<style scoped></style>
