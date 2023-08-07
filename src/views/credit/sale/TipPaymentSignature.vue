<template>
  <div class="card grow py-7 px-10">
    <div class="bg-primary-lighter px-5 py-6 text-center rounded-lg mb-12 flex items-center justify-between">
      <p class="mb-0">Amount</p>
      <p class="text-4xl text-primary font-semibold mb-0">{{ currencyFormatter(payTotalValue) }}</p>
    </div>
    <div class="text-center">
      <h2 class="text-xl font-semibold mb-1">Signature</h2>
      <p class="mb-0">Transaction approved. Please sign your name</p>
      <div class="bg-white shadow-[1px_1px_6px_0_rgba(0,0,0,0.15)] rounded-lg mt-4">
        <VueSignaturePad width="100%" height="320px" scale-to-device-pixel-ratio ref="signaturePadRef" />
      </div>
      <div class="grid grid-cols-2 gap-3 max-w-[396px] mx-auto mt-6">
        <a-button type="ghost" danger @click="handleReset">Reset</a-button>
        <a-button type="primary" @click="handleOk">OK</a-button>
      </div>
    </div>
  </div>

  <modal-status ref="modalStatusRef"></modal-status>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {usePaymentStore} from '@/stores/payment';
import ModalStatus from '@/components/ModalStatus.vue';
import {currencyFormatter} from '@/utils/format';
import {useRouter} from 'vue-router';
import handleError from '@/utils/error';

const paymentStore = usePaymentStore();
const payTotalValue = computed(() => paymentStore.payTotalValue);
const signaturePadRef = ref<any>(null);
const router = useRouter();

const modalStatusRef = ref<InstanceType<typeof ModalStatus> | null>(null);
const handleReset = () => {
  signaturePadRef.value?.undoSignature();
};
const handleOk = async () => {
  try {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const {isEmpty, data} = signaturePadRef.value?.saveSignature();
    if (isEmpty) {
      throw new Error('Please enter your signature!');
    }
    modalStatusRef.value?.show({
      status: 'success',
      describe: 'Save signature success!',
      afterClose: () => {
        router.push({
          name: 'credit',
        });
      },
    });
  } catch (error: any) {
    handleError({error});
  }
};
</script>

<style scoped lang="scss"></style>
