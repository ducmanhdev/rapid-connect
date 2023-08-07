<template>
  <section class="card grow p-0">
    <div class="divide-y child:py-5 child:px-[30px]">
      <div class="flex items-center justify-between py-3.5 px-5 space-x-3">
        <div class="flex items-center space-x-3">
          <a-date-picker
            class="w-[170px] font-medium"
            v-model:value="filterModel.picker"
            :picker="filterModel.pickerMode"
            :value-format="DATE_FORMAT"
            input-read-only
          />
          <a-select class="w-[110px]" :options="pickerModeList" v-model:value="filterModel.pickerMode"></a-select>
        </div>
        <button type="button" class="w-[30px] h-[30px] grid-place-items-center" @click="handleReload">
          <img src="@/assets/images/icon-refresh.svg" alt="" />
        </button>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">Batch close history</h2>
        <base-loading v-if="isGetBatchCloseHistoryLoading"></base-loading>
        <div v-else-if="listBatchCloseHistory?.length > 0" class="overflow-x-auto">
          <div class="min-w-[700px] border">
            <div class="grid grid-cols-[2fr_2fr_2fr_2fr_1fr] child:p-2 font-bold">
              <div class="border-r">DATE</div>
              <div class="text-center border-r">TOTAL COUNT</div>
              <div class="text-center border-r">TOTAL AMOUNT</div>
              <div class="text-center border-r">TOTAL TIP</div>
              <div class="text-center"></div>
            </div>
            <div
              v-for="item in listBatchCloseHistory"
              :key="item.timestamp"
              class="grid grid-cols-[2fr_2fr_2fr_2fr_1fr] child:p-2 border-t"
            >
              <div class="border-r">{{ timestampToDate(item?.timestamp) }}</div>
              <div class="text-center border-r">{{ item?.creditCount }}</div>
              <div class="text-center border-r">{{ currencyFormatter(item?.creditAmount / 100) }}</div>
              <div class="border-r">{{ currencyFormatter(item?.totalTip / 100) }}</div>
              <div class="text-center">
                <router-link :to="{name: 'credit-history-list', params: {batchTimestamp: item.timestamp}}" class="btn"
                  >Detail</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <a-empty class="p-4" v-else></a-empty>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">Sales Summary</h2>
        <base-loading v-if="isGetListHistoryLoading"></base-loading>
        <div v-else-if="listHistoryFiltered?.length > 0">
          <p class="mb-3">{{ listHistoryRange }}</p>
          <div
            class="divide-y max-w-md font-bold child:grid child:grid-cols-2 child:gap-2 child:py-2 [&>*>*:nth-child(2)]:text-right"
          >
            <div>
              <div>TOTAL RECORDS:</div>
              <div>{{ listHistoryFiltered.length }}</div>
            </div>
            <div>
              <div>TOTAL AMOUNT:</div>
              <div>{{ currencyFormatter(listHistoryTotalAmount / 100) }}</div>
            </div>
            <div>
              <div>TOTAL TIP AMOUNT:</div>
              <div>{{ currencyFormatter(listHistoryTotalTip / 100) }}</div>
            </div>
            <div>
              <div>TOTAL REFUND AMOUNT:</div>
              <div>{{ currencyFormatter(listHistoryTotalRefund / 100) }}</div>
            </div>
            <div>
              <div>TOTAL VOID AMOUNT:</div>
              <div>{{ currencyFormatter(listHistoryTotalVoid / 100) }}</div>
            </div>
            <div></div>
          </div>
        </div>
        <a-empty class="p-4" v-else></a-empty>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import handleError from '@/utils/error';
import BaseLoading from '@/components/BaseLoading.vue';
import dayjs from 'dayjs';
import type {OpUnitType} from 'dayjs';
import {currencyFormatter, timestampToDate} from '@/utils/format';
import {useHistoryStore} from '@/stores/history';
import {db} from '@/database';
import {DATE_FORMAT} from '@/constans';
import {TRANS_TYPE} from 'pax-ts';

const pickerModeList = [
  {
    label: 'Day',
    value: 'date',
  },
  {
    label: 'Month',
    value: 'month',
  },
  {
    label: 'Year',
    value: 'year',
  },
];
const filterModel = ref({
  picker: dayjs().format(DATE_FORMAT),
  pickerMode: 'date',
  device: 0,
});
const historyStore = useHistoryStore();
const listHistory = ref<any>([]);
const listHistoryFiltered = computed(() =>
  listHistory.value.filter((transaction: any) => {
    const date = timestampToDate(transaction?.traceInformation?.timeStamp);
    return dayjs(date).isSame(dayjs(filterModel.value.picker), filterModel.value.pickerMode as OpUnitType);
  })
);

const listBatchCloseHistory = ref<any[]>([]);
const isGetBatchCloseHistoryLoading = ref(false);
const getListBatchCloseHistory = async () => {
  try {
    isGetBatchCloseHistoryLoading.value = true;
    const res = await db.listBatchClose.toArray();
    listBatchCloseHistory.value = res
      .filter((item: any) => {
        const date = timestampToDate(item?.timestamp);
        return dayjs(date).isSame(dayjs(filterModel.value.picker), filterModel.value.pickerMode as OpUnitType);
      })
      .map((item: any) => {
        const list = JSON.parse(item.list);
        item.totalTip = list
          .filter((transaction: any) => +transaction.paymentType === +TRANS_TYPE.SALE)
          .reduce((total: number, current: any) => {
            return total + Number(current?.amountInformation?.tipAmount);
          }, 0);
        return item;
      });
  } catch (error) {
    console.error(error);
  } finally {
    isGetBatchCloseHistoryLoading.value = false;
  }
};

const isGetListHistoryLoading = ref(false);
const handleGetListHistory = async () => {
  try {
    isGetListHistoryLoading.value = true;
    listHistory.value = await historyStore.getListHistory();
  } catch (error: any) {
    handleError({error});
  } finally {
    isGetListHistoryLoading.value = false;
  }
};
const listHistoryRange = computed(() => {
  if (!listHistory.value?.length) return;
  const FORMAT = 'MMMM D, YYYY h:mm:ss A';
  const timeStartTimestamp = listHistory.value[0]?.date;
  const timeEndTimestamp = listHistory.value[listHistory.value.length - 1]?.date;
  const timeStart = dayjs(timeStartTimestamp).format(FORMAT);
  const timeEnd = dayjs(timeEndTimestamp).format(FORMAT);
  return `${timeStart} - ${timeEnd}`;
});
const listHistoryTotalAmount = computed(() => {
  if (!listHistory.value.length) return 0;
  return listHistory.value
    .filter((transaction: any) => +transaction.paymentType === +TRANS_TYPE.SALE)
    .reduce((total: number, currentTransaction: any) => {
      return total + Number(currentTransaction?.amountInformation.approveAmount);
    }, 0);
});
const listHistoryTotalTip = computed(() => {
  if (!listHistory.value.length) return 0;
  return listHistory.value
    .filter((transaction: any) => +transaction.paymentType === +TRANS_TYPE.SALE)
    .reduce((total: number, currentTransaction: any) => {
      return total + Number(currentTransaction?.amountInformation.tipAmount);
    }, 0);
});
const listHistoryTotalRefund = computed(() => {
  if (!listHistory.value.length) return 0;
  return listHistory.value
    .filter((transaction: any) => +transaction.paymentType === +TRANS_TYPE.RETURN)
    .reduce((total: number, currentTransaction: any) => {
      return total + Number(currentTransaction?.amountInformation.approveAmount);
    }, 0);
});
const listHistoryTotalVoid = computed(() => {
  if (!listHistory.value.length) return 0;
  return listHistory.value
    .filter((transaction: any) =>
      Object.entries(TRANS_TYPE)
        .filter(([key]) => key.startsWith('VOID'))
        .map(([_, value]) => value)
        .includes(transaction.paymentType.padStart(2, '0'))
    )
    .reduce((total: number, currentTransaction: any) => {
      return total + Number(currentTransaction?.amountInformation.approveAmount);
    }, 0);
});
const isReloadLoading = ref(false);
const handleReload = async () => {
  try {
    isReloadLoading.value = true;
    await Promise.allSettled([handleGetListHistory(), getListBatchCloseHistory()]);
  } finally {
    isReloadLoading.value = false;
  }
};
watch([() => filterModel.value.picker, () => filterModel.value.pickerMode], handleReload, {immediate: true});
</script>

<style scoped lang="scss"></style>
