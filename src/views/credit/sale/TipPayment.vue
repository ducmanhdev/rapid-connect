<template>
  <section class="card grow">
    <div class="bg-primary-lighter px-5 py-6 text-center rounded-lg mb-12">
      <p class="text-4xl text-primary font-semibold mb-1">{{ currencyFormatter(payTotalValue) }}</p>
      <p class="mb-0">Total Amount</p>
    </div>
    <div class="text-center">
      <img class="block mx-auto mb-4" src="@/assets/images/tip-card.svg" alt="" />
      <h2 class="text-xl font-semibold mb-1">Payment</h2>
      <p class="mb-0">Make your credit card payment</p>
      <div class="grid grid-cols-2 gap-3 max-w-[396px] mx-auto mt-[80px]">
        <a-button type="ghost" danger @click="handleCancel">Cancel</a-button>
        <a-button type="primary" @click="handleOk">OK</a-button>
      </div>
    </div>
  </section>

  <modal-status ref="modalStatusRef"></modal-status>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import ModalStatus from '@/components/ModalStatus.vue';
import {currencyFormatter} from '@/utils/format';
import {dateToUUID} from '@/utils/transform';
import {usePaymentStore} from '@/stores/payment';
import {useRouter} from 'vue-router';
import {useGeneralStore} from '@/stores/general';
import handleError from '@/utils/error';

const generalStore = useGeneralStore();
const router = useRouter();
const paymentStore = usePaymentStore();
const payTotalValue = computed(() => paymentStore.payTotalValue);
const modalStatusRef = ref<InstanceType<typeof ModalStatus> | null>(null);
const handlePayment = async () => {
  try {
    if (!generalStore.isPaxConnected) {
      throw new Error(`Can't pay, no pax is connected yet!`);
    }
    modalStatusRef.value?.show({
      status: 'loading',
      title: 'Payment',
      describe: 'Waiting for payment...',
    });
    // const referenceNumber = dayjs().format('YYMDHms');
    const response: any = await generalStore.pax?.doSales({
      amount: paymentStore.payValue * 100,
      tips: paymentStore.tipValue * 100,
      orderID: dateToUUID(),
    });
    if (response?.responseMessage !== 'OK') {
      modalStatusRef.value?.hide();
      throw new Error(response?.responseMessage);
    }
    modalStatusRef.value?.show({
      status: 'success',
      title: 'Payment',
      describe: 'Payment successful!',
      afterClose: () => {
        router.push({
          name: 'credit-sale-tip-payment-signature',
          params: {
            referenceNumber: response.paxPaymentResponse.traceInformation.referenceNumber,
            transactionNumber: response.paxPaymentResponse.traceInformation.transactionNumber,
            paxSerialNumber: generalStore.paxSerialNumber,
          },
        });
      },
    });
  } catch (error: any) {
    handleError({error});
    modalStatusRef.value?.hide();
  }
};
const handleOk = () => {
  handlePayment();
};
const handleCancel = () => {
  router.push({
    name: 'credit',
  });
};
</script>

<style scoped lang="scss"></style>
