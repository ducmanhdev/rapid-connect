<template>
  <div
    @click="
      router.push({
        name: 'credit-history-detail',
        params: {
          referenceNumber: item?.traceInformation?.referenceNumber,
          batchTimestamp: item?.batchTimestamp,
        },
      })
    "
    class="rounded-lg border bg-white text-black grid grid-cols-7 gap-3 py-4 px-5 cursor-pointer hover:border-primary"
  >
    <div>
      <div>{{ dayjs(item?.traceInformation?.timeStamp).format('HH:mm:ss') }}</div>
      <div class="text-C87 text-xs">{{ dayjs(item?.traceInformation?.timeStamp).format('DD/MM/YYYY') }}</div>
    </div>
    <div class="text-center">{{ item?.traceInformation?.referenceNumber }}</div>
    <div class="text-center">{{ item?.traceInformation?.transactionNumber }}</div>
    <div class="">
      <div class="grid grid-cols-[14px_1fr] gap-2 items-center">
        <svg
          v-if="item?.hostInformation?.hostResponseMessage === 'APPROVED' || item?.hostInformation?.hostResponseMessage === 'DEMO APPROVED'"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.6667 3.5L5.25 9.91667L2.33334 7"
            stroke="#27AE60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.5 3.5L3.5 10.5"
            stroke="#EC4545"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.5 3.5L10.5 10.5"
            stroke="#EC4545"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div>{{ transactionType }}</div>
      </div>
      <div class="text-C87 text-xs pl-[22px]">{{ item?.hostInformation?.hostReferenceNumber }}</div>
    </div>
    <div class="text-center font-semibold text-primary" :class="{'!text-error': isVoidRefund}">
      {{ isVoidRefund ? '-' : `${currencyFormatter(item.amountInformation?.tipAmount / 100)}` }}
    </div>
    <div class="text-center font-semibold text-primary" :class="{'!text-error': isVoidRefund}">
      {{ isVoidRefund ? '-' : '' }}
      {{ currencyFormatter(item.amountInformation?.approveAmount / 100) }}
    </div>
    <div>
      <div class="grid grid-cols-[27px_1fr] gap-2 items-center">
        <card-icon :code="item?.accountInformation?.cardType"></card-icon>
        <div>-</div>
      </div>
      <div class="text-C87 text-xs pl-[35px]">
        {{ reverseObject(CARD_TYPE)[item?.accountInformation?.cardType] }} {{ item?.accountInformation?.account }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import dayjs from 'dayjs';
import CardIcon from '@/components/CardIcon.vue';
import {currencyFormatter} from '@/utils/format';
import {reverseObject} from '@/utils/transform';
import {CARD_TYPE, TRANS_TYPE} from 'pax-ts';
import {useRouter} from 'vue-router';

const router = useRouter();
const props = defineProps<{
  item: any;
}>();

const transactionType = computed(() => {
  const result = reverseObject(TRANS_TYPE)[props.item?.paymentType.padStart(2, '0')];
  return result === 'RETURN' ? 'REFUND' : result;
});
const isVoidRefund = computed(() =>
  [
    TRANS_TYPE.VOID,
    TRANS_TYPE.VOID_FRCD,
    TRANS_TYPE.VOID_RETURN,
    TRANS_TYPE.VOID_SALE,
    TRANS_TYPE.VOID_POST,
    TRANS_TYPE.VOID_AUTH,
    TRANS_TYPE.RETURN,
  ].includes(props.item?.paymentType.padStart(2, '0'))
);
</script>

<style scoped lang="scss"></style>
