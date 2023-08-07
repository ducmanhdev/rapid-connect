<template>
  <section class="card grow">
    <div class="bg-primary-lighter px-5 py-6 text-center rounded-lg mb-4 md:mb-8">
      <p class="font-semibold text-2xl mb-1">Add a Tip</p>
      <p class="text-lg mb-0">Your bill: {{ currencyFormatter(payValue) }}</p>
    </div>
    <div class="grid grid-cols-2 gap-4 md:gap-x-10 md:gap-y-6 max-w-[512px] mx-auto">
      <button
        type="button"
        v-for="item in listTip"
        :key="item.value"
        @click="handleAddTip(item.value)"
        class="grid place-content-center min-h-[112px] cursor-pointer bg-white rounded-lg text-center p-6 shadow-[1px_1px_8px_rgba(0,0,0,0.2)]"
      >
        <span class="block text-3xl font-semibold text-primary mb-0">{{ item.percent }}</span>
        <span class="block text-base mb-0">{{ item.title }}</span>
      </button>
      <button
        type="button"
        @click="handleAddTip(0)"
        class="text-2xl font-semibold grid place-content-center min-h-[112px] cursor-pointer border border-current bg-white text-error rounded-lg text-center p-6 shadow-[1px_1px_8px_rgba(0,0,0,0.2)]"
      >
        No tip
      </button>
      <button
        type="button"
        @click="handleCustomTip"
        class="text-2xl font-semibold grid place-content-center min-h-[112px] cursor-pointer bg-primary text-white rounded-lg text-center p-6 shadow-[1px_1px_8px_rgba(0,0,0,0.2)]"
      >
        Custom
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed, onBeforeMount} from 'vue';
import {usePaymentStore} from '@/stores/payment';
import {currencyFormatter} from '@/utils/format';
import {useRouter} from 'vue-router';

const router = useRouter();
const paymentStore = usePaymentStore();
const payValue = computed(() => paymentStore.payValue);
const tipValue = computed({
  get() {
    return paymentStore.tipValue;
  },
  set(newValue: string | number) {
    paymentStore.tipValue = Number(newValue);
  },
});
const handleAddTip = (value: string | number) => {
  tipValue.value = value;
  router.push({
    name: 'credit-sale-tip-payment',
  });
};
const handleCustomTip = () => {
  router.push({name: 'credit-sale-custom-tip'});
};

onBeforeMount(() => {
  const isEnableTip = JSON.parse(localStorage.getItem('isEnableTip')!);
  if (!isEnableTip) {
    tipValue.value = 0;
    router.push({
      name: 'credit-sale-tip-payment',
    });
  }
});

const percentage = (partialValue: number) => ((partialValue / 100) * payValue.value).toFixed(2);
const tipMode = JSON.parse(localStorage.getItem('tipMode')!);
const listTipSuggestion = JSON.parse(localStorage.getItem('listSuggestion') || '[]');
const listTip = computed(() =>
  listTipSuggestion.map((item: any) => ({
    percent: `${item.value}${tipMode}`,
    value: tipMode === '%' ? percentage(item.value) : item.value,
    title: item.title,
  }))
);
</script>

<style scoped lang="scss"></style>
