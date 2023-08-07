<template>
  <section class="card grow p-0">
    <div class="divide-y">
      <div class="grid grid-cols-[1fr_30px] gap-2 justify-items-center px-[30px] py-5">
        <router-link :to="{name: 'settings'}" type="button" class="flex items-center w-full text-inherit">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          Tip suggestions
        </router-link>
        <button type="button" @click="handleReload">
          <img src="@/assets/images/icon-refresh.svg" alt="" />
        </button>
      </div>
      <div class="px-[30px] py-5">
        <base-loading class="p-4" v-if="isGetListSuggestionLoading"></base-loading>
        <template v-else>
          <div class="flex items-center gap-3 mb-3">
            <a-switch v-model:checked="isEnableTip" />
            <span>Tip or no tip</span>
          </div>
          <div class="mb-3">
            <p>
              Setup to 4 default tips for a customer to choose from when signing on screen (in addition to options for
              custom and no tip).<br />If you are setup to have customers sign on on the printed receipt, the calculated
              tip and total for these suggestions will appear at the bottom of the receipt.
            </p>
            <a-radio-group v-model:value="tipMode">
              <a-radio value="%">%</a-radio>
              <a-radio value="$">$</a-radio>
            </a-radio-group>
          </div>
          <div class="flex justify-between items-center gap-3 mb-3">
            <p class="mb-0 font-semibold text-base">Choose options</p>
            <button type="button" class="btn" @click="handleCreate">Create</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="child:p-2 child:text-center">
                  <th width="15%">Enable</th>
                  <th width="35%">Tip ({{ tipMode }})</th>
                  <th width="35%">Tip suggestions</th>
                  <th width="15%">Action</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="listSuggestion?.length">
                  <tr v-for="item in listSuggestion" :key="item.id" class="border-t child:p-2 child:text-center">
                    <td>
                      <a-checkbox v-model:checked="item.isEnable"></a-checkbox>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        v-model="item.value"
                        class="text-center outline-none appearance-none"
                      />
                    </td>
                    <td>
                      <input type="text" v-model="item.title" class="text-center outline-none appearance-none" />
                    </td>
                    <td class="flex justify-center">
                      <svg
                        @click="handleDelete(item.id)"
                        class="cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </td>
                  </tr>
                </template>
                <tr v-else class="border-t child:p-2 child:text-center">
                  <td colspan="100%">
                    <a-empty class="p-4"></a-empty>
                  </td>
                </tr>
                <tr class="border-t child:p-2 child:text-center">
                  <td colspan="100%">
                    <a-button type="primary" class="min-w-[190px]" @click="saveToLocalStorage">Save</a-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {notification} from 'ant-design-vue';
import {jsonToObject} from '@/utils/json';
import BaseLoading from '@/components/BaseLoading.vue';

const isEnableTip = ref(JSON.parse(localStorage.getItem('isEnableTip')!) || 'true');
const tipMode = ref(JSON.parse(localStorage.getItem('tipMode')!) || '%');

type Suggestion = {
  id: number;
  isEnable: boolean;
  value?: number;
  title?: string;
};

const defaultListSuggestion = [
  {
    id: 1,
    isEnable: true,
    value: 10,
    title: 'Good',
  },
  {
    id: 2,
    isEnable: true,
    value: 20,
    title: 'Wow',
  },
  {
    id: 3,
    isEnable: true,
    value: 30,
    title: 'Great',
  },
  {
    id: 4,
    isEnable: true,
    value: 40,
    title: 'Best service ever',
  },
];
const listSuggestion = ref<Suggestion[]>([]);
const handleCreate = () => {
  listSuggestion.value.push({
    id: Date.now(),
    isEnable: false,
  });
};
const handleDelete = (id: number) => {
  listSuggestion.value = listSuggestion.value.filter((item: Suggestion) => item.id !== id);
};
const saveToLocalStorage = () => {
  localStorage.setItem('isEnableTip', JSON.stringify(isEnableTip.value));
  localStorage.setItem('tipMode', JSON.stringify(tipMode.value));
  localStorage.setItem('listSuggestion', JSON.stringify(listSuggestion.value));
  notification.success({
    message: 'Update suggestions successfully!',
  });
};

const isGetListSuggestionLoading = ref(false);
const handleGetListSuggestion = () => {
  isGetListSuggestionLoading.value = true;
  setTimeout(() => {
    listSuggestion.value = jsonToObject(localStorage.getItem('listSuggestion') || defaultListSuggestion);
    isGetListSuggestionLoading.value = false;
  }, 1000);
};
handleGetListSuggestion();
const handleReload = () => {
  handleGetListSuggestion();
};
</script>

<style scoped></style>
