<template>
  <section class="card grow">
    <div class="bg-primary-lighter px-5 py-6 text-center rounded-lg mb-8">
      <p class="mb-1">Custom tip on {{ currencyFormatter(paymentStore.payValue) }}</p>
      <currency-input
        v-model="value"
        @focusin="handleInputFocusIn"
        hide-default-keyboard
        class="!w-full !text-4xl !bg-transparent !text-primary !font-semibold !text-center"
      ></currency-input>
    </div>
    <div ref="input"></div>
    <div class="text-center">
      <a-button type="primary" class="min-w-[190px]" @click="handlePay"
        >PAY {{ currencyFormatter(paymentStore.payTotalValue) }}</a-button
      >
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useNumpadStore} from '@/stores/numpad';
import {usePaymentStore} from '@/stores/payment';
import {currencyFormatter} from '@/utils/format';
import {useRouter} from 'vue-router';
import CurrencyInput from '@/components/CurrencyInput.vue';

const router = useRouter();
const numpadStore = useNumpadStore();
const paymentStore = usePaymentStore();
const value = computed({
  get() {
    return paymentStore.tipValue;
  },
  set(newValue) {
    paymentStore.tipValue = newValue;
  },
});
const handleInputFocusIn = (event: any) => {
  event.preventDefault();
  numpadStore.handleShow(value, event.target);
};
const handlePay = () => {
  router.push({
    name: 'credit-sale-tip-payment',
  });
};
</script>

<style scoped lang="scss">
:deep {
  .ant-input-number-input {
    height: 46px;
    text-align: inherit;
  }
}
</style>
