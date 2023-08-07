<template>
  <section class="card grow p-0">
    <div class="divide-y">
      <div class="grid grid-cols-[1fr_30px] gap-2 py-3.5 px-[30px] justify-items-center">
        <router-link :to="{name: 'settings'}" type="button" class="flex items-center w-full text-inherit">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          Settings
        </router-link>
        <button type="button">
          <img src="@/assets/images/icon-refresh.svg" alt="" />
        </button>
      </div>
      <div class="px-[30px] py-3">
        <p class="text-base font-medium mb-0">Order receipt printer</p>
        <p class="text-C82 mb-0">Add order printers</p>
      </div>
      <div>
        <div class="px-[30px] pt-3">
          <p class="text-base font-medium mb-0">Order receipt print timing</p>
          <p class="text-C82 mb-0">When printing customer receipt</p>
        </div>
        <a-checkbox-group
          class="w-full child:!mr-0 child:!flex divide-y divide-CE6 child:!px-[30px] child:!py-3"
          name="orders"
          :options="options"
          v-model:value="value"
        />
      </div>
      <div class="px-[30px] py-3">
        <p class="text-base font-medium mb-0">Order numbers</p>
        <p class="text-C82 mb-0">None</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 divide-x divide-C82 border-C82">
        <div class="child:px-[30px] child:py-3 divide-y divide-CE6">
          <p class="text-lg font-semibold mb-0">Order Receipt Appearance</p>
          <div>
            <p class="text-base font-medium mb-0">Order numbers</p>
            <p class="text-C82 mb-0">None</p>
          </div>
          <div>
            <p class="text-base font-medium mb-0">Blank lines in header</p>
            <p class="text-C82 mb-0">8</p>
          </div>
          <a-checkbox-group
            class="w-full child:!mr-0 child:!flex divide-y divide-CE6 child:!px-[30px] child:!py-4"
            name="orders"
            :options="options"
            v-model:value="value"
          />
        </div>
        <div class="child:px-[30px] child:py-3 divide-y divide-CE6">
          <p class="text-lg font-semibold text-center mb-0">Receipt Preview</p>
          <div>
            <p class="text-lg font-semibold mb-4 text-center">Table 46</p>
            <ul class="mb-4">
              <li>Server: John</li>
              <li>12-Feb-2023 8:56:42 PM</li>
              <li>Sent: 8:56:42P</li>
              <li>Service Name</li>
            </ul>
            <ul>
              <li>Large Beverage</li>
              <li>Large Beverage</li>
              <li>ID: 234452HDJS83790</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const value = ref([0]);
const options = [
  {label: 'Remain in category after adding an item to an order', value: 0},
  {label: 'Reprinting order receipt requires manager Passcode', value: 1},
];
</script>

<style scoped></style>
