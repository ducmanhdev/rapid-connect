import {ref, computed} from 'vue';
import {defineStore} from 'pinia';

export const usePaymentStore = defineStore('paymentStore', () => {
  const payValue = ref<number>(0);
  const tipValue = ref<number>(0);
  const payTotalValue = computed(() => payValue.value + tipValue.value);
  return {
    payValue,
    tipValue,
    payTotalValue,
  };
});
