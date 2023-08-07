<template>
  <a-modal
    v-model:visible="isVisible"
    :footer="false"
    :width="552"
    title="Refund Options"
    centered
    :body-style="{padding: '40px 24px'}"
  >
    <div class="w-[430px] mx-auto child:grid child:grid-cols-[110px_1fr] child:items-center space-y-3">
      <div>
        <div class="font-semibold">Total</div>
        <div class="font-semibold text-lg">{{ currencyFormatter(total / 100) }}</div>
      </div>
      <div>
        <div class="font-semibold">Amount</div>
        <div>
          <currency-input
            v-model="amount"
            :class="[refundError ? 'input-error' : 'input-primary']"
            :disabled="isFullRefund"
          ></currency-input>
          <p class="text-error mt-2 mb-0">{{ refundError }}</p>
        </div>
      </div>
      <div>
        <div>Is full refund?</div>
        <div>
          <a-checkbox v-model:checked="isFullRefund"></a-checkbox>
        </div>
      </div>
      <div>
        <div></div>
        <div>
          <a-button type="primary" class="w-[190px]" @click="handleOk">OK</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import {currencyFormatter} from '@/utils/format';
import CurrencyInput from '@/components/CurrencyInput.vue';

const emits = defineEmits<{
  (e: 'confirmRefund', refundAmount: number): void;
}>();

const props = defineProps<{
  total: number;
}>();

const amount = ref(0);
const isFullRefund = ref<boolean>(false);
watch(
  isFullRefund,
  (newValue: boolean) => {
    if (newValue) {
      amount.value = props.total / 100;
      refundError.value = null;
    }
  },
  {immediate: true}
);

const refundError = ref<string | null>(null);
const handleOk = () => {
  if (amount.value * 100 > props.total) {
    return (refundError.value = `Amount can't large than total!`);
  }
  emits('confirmRefund', amount.value);
  hide();
};
const isVisible = ref(false);
const show = () => {
  amount.value = 0;
  isFullRefund.value = false;
  isVisible.value = true;
};
const hide = () => (isVisible.value = false);
defineExpose({
  show,
  hide,
});
</script>

<style lang="scss">
:deep {
}
</style>
