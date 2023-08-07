<template>
  <section class="card grow p-0">
    <div class="grid grid-cols-[1fr_30px] gap-2 py-3.5 px-5 justify-items-center">
      <input
        type="text"
        class="rounded-3xl border border-transparent text-A4 w-full h-[34px] text-sm appearance-none outline-none pl-[34px] pr-4 transition bg-[url('@/assets/images/icon-search.svg')] bg-no-repeat bg-[left_10px_center] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] focus:border-primary focus:shadow-none"
        placeholder="Search number or ID"
        v-model="searchReferenceNumber"
      />
      <button type="button" @click="handleReload" :class="{'pointer-events-none opacity-50 rotate': isReloadLoading}">
        <img src="@/assets/images/icon-refresh.svg" alt="" />
      </button>
    </div>
    <div class="overflow-x-auto w-full">
      <div class="min-w-[1100px]">
        <div class="bg-primary text-white grid grid-cols-7 gap-3 py-3 px-[34px] text-base font-medium text-center">
          <div>Date</div>
          <div>Reference #</div>
          <div>Transaction #</div>
          <div>Transaction type</div>
          <div>Tip</div>
          <div>Total</div>
          <div>Card details</div>
        </div>
        <div class="py-4 px-3.5 space-y-4">
          <base-loading v-if="isGetListHistoryLoading"></base-loading>
          <template v-else-if="listHistoryWithSearch?.length">
            <list-item
              v-for="item in listHistoryWithSearch"
              :item="item"
              :key="item?.traceInformation?.transactionNumber"
            ></list-item>
          </template>
          <a-empty v-else></a-empty>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import handleError from '@/utils/error';
import BaseLoading from '@/components/BaseLoading.vue';
import ListItem from './ListItem.vue';
import {useHistoryStore} from '@/stores/history';
import {useRoute} from 'vue-router';

const route = useRoute();
const searchReferenceNumber = ref('');
const historyStore = useHistoryStore();

const listHistory = ref<any>([]);
const listHistoryWithSearch = computed(() => {
  return listHistory.value.filter((transaction: any) => {
    if (searchReferenceNumber.value) {
      return transaction.traceInformation.referenceNumber.includes(searchReferenceNumber.value);
    }
    return true;
  });
});
const isGetListHistoryLoading = ref(false);
const handleGetListHistory = async () => {
  try {
    isGetListHistoryLoading.value = true;
    listHistory.value = await historyStore.getListHistory(route.params.batchTimestamp as string);
  } catch (error: any) {
    handleError({error});
  } finally {
    isGetListHistoryLoading.value = false;
  }
};
handleGetListHistory();
const isReloadLoading = ref(false);
const handleReload = async () => {
  try {
    isReloadLoading.value = true;
    await handleGetListHistory();
  } finally {
    isReloadLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotate {
  animation: rotate 1s infinite;
  animation-timing-function: linear;
}
</style>
