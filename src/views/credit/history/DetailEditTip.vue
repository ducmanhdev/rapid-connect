<template>
  <section class="card grow p-0">
    <div class="divide-y child:py-5 child:px-[30px] grid grid-rows-[auto_1fr_auto] h-full">
      <div class="py-3.5 px-5">
        <button type="button" class="flex items-center" @click="router.back()">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          {{ isGotTip ? 'Edit Tip' : 'Add Tip' }}
        </button>
      </div>
      <div class="space-y-6">
        <base-loading v-if="isGetHistoryDetailLoading"></base-loading>
        <a-empty v-else-if="!historyDetail"></a-empty>
        <template v-else>
          <div class="space-y-1.5">
            <div class="grid grid-cols-[140px_1fr] gap-3">
              <div class="text-C82">Employee:</div>
              <div>-</div>
            </div>
            <div class="grid grid-cols-[140px_1fr] gap-3">
              <div class="text-C82">Payment ID:</div>
              <div>{{ historyDetail.traceInformation?.referenceNumber }}</div>
            </div>
            <div class="grid grid-cols-[140px_1fr] gap-3">
              <div class="text-C82">Time:</div>
              <div>{{ dayjs(historyDetail?.date).format('MMMM DD, YYYY h:mm:ss A') }}</div>
            </div>
          </div>
          <div class="space-y-1.5">
            <div class="grid grid-cols-[140px_1fr] gap-3">
              <div>Transaction:</div>
              <div class="font-semibold">{{ historyDetail?.traceInformation?.transactionNumber }}</div>
            </div>
            <div class="grid grid-cols-[140px_1fr] gap-3">
              <div>Card:</div>
              <div class="font-semibold">
                {{ reverseObject(CARD_TYPE)[historyDetail?.accountInformation?.cardType] }}
                {{ historyDetail?.accountInformation?.account }}
              </div>
            </div>
          </div>
          <div class="space-y-1.5">
            <div class="grid grid-cols-[140px_1fr] gap-3">
              <div>Subtotal:</div>
              <div>{{ currencyFormatter(amountBeforeTip / 100) }}</div>
            </div>
            <div class="grid grid-cols-[140px_1fr] gap-3">
              <div>Tip:</div>
              <div class="relative">
                <currency-input v-model="tipComputed" class="tip-input !pr-[100px]"></currency-input>
                <div
                  class="absolute right-0 top-0 bottom-0 grid place-items-center px-5"
                  :class="[tipPercent === '0.00%' ? 'text-CD9' : 'text-C27']"
                >
                  {{ tipPercent }}
                </div>
              </div>
            </div>
            <div class="grid grid-cols-[140px_1fr] gap-3">
              <div>Total:</div>
              <div class="text-lg font-semibold text-primary">{{ currencyFormatter(amountAfterTip / 100) }}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="">
        <div class="grid grid-cols-2 gap-3 max-w-[398px]">
          <a-button type="ghost" danger @click="router.back()" :disabled="isGetHistoryDetailLoading || isUpdateLoading">
            Cancel
          </a-button>
          <a-button type="primary" @click="handleUpdate" :disabled="isGetHistoryDetailLoading || isUpdateLoading">
            Done
          </a-button>
        </div>
      </div>
    </div>
  </section>
  <modal-confirm ref="modalConfirmRef"></modal-confirm>
  <modal-status ref="modalStatusRef"></modal-status>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import handleError from '@/utils/error';
import {useGeneralStore} from '@/stores/general';
import {useRoute, useRouter} from 'vue-router';
import dayjs from 'dayjs';
import {reverseObject} from '@/utils/transform';
import {CARD_TYPE} from 'pax-ts';
import {currencyFormatter} from '@/utils/format';
import BaseLoading from '@/components/BaseLoading.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import CurrencyInput from '@/components/CurrencyInput.vue';
import ModalStatus from '@/components/ModalStatus.vue';
import {useHistoryStore} from '@/stores/history';

const generalStore = useGeneralStore();
const historyStore = useHistoryStore();
const router = useRouter();
const route = useRoute();
const tip = ref(0);
const tipComputed = computed({
  get() {
    return tip.value || 0;
  },
  set(newValue: any) {
    tip.value = newValue ? Number(newValue) : 0;
  },
});

const tipPercent = computed(() => (((tipComputed.value * 100) / amountBeforeTip.value) * 100).toFixed(2) + '%');
const historyDetail = ref<any>(null);
const isGetHistoryDetailLoading = ref(false);
const handleGetHistoryDetail = async () => {
  try {
    if (
      historyStore?.historyDetail &&
      historyStore?.historyDetail?.traceInformation?.referenceNumber === route.params?.referenceNumber
    ) {
      historyDetail.value = historyStore?.historyDetail;
      tipComputed.value = historyDetail.value.amountInformation.tipAmount / 100;
      return;
    }
    isGetHistoryDetailLoading.value = true;
    historyDetail.value = await historyStore.getHistoryDetail({
      referenceNumber: route.params.referenceNumber as string,
    });
    tipComputed.value = historyDetail.value.amountInformation.tipAmount / 100;
  } catch (error: any) {
    handleError({error});
  } finally {
    isGetHistoryDetailLoading.value = false;
  }
};
handleGetHistoryDetail();
const amountBeforeTip = computed(
  () =>
    (historyDetail.value?.amountInformation?.approveAmount || 0) -
    (historyDetail.value?.amountInformation?.tipAmount || 0)
);
const amountAfterTip = computed(() => amountBeforeTip.value + tipComputed.value * 100);
const modalConfirmRef = ref<InstanceType<typeof ModalConfirm> | null>(null);
const modalStatusRef = ref<InstanceType<typeof ModalStatus> | null>(null);
const isUpdateLoading = ref(false);
const handleUpdate = async () => {
  try {
    isUpdateLoading.value = true;
    await modalConfirmRef.value?.show({
      title: 'Confirm Tip',
      describe: `Is this tip of ${currencyFormatter(tipComputed.value)} (${tipPercent.value}) correct?`,
      cancelText: 'Cancel',
      okText: 'Confirm Tip',
    });
    const response: any = await generalStore.pax?.doAdjust({
      reference: historyDetail.value?.traceInformation?.referenceNumber,
      transaction: historyDetail.value?.traceInformation?.transactionNumber,
      amount: tipComputed.value,
    });
    if (response?.responseMessage !== 'OK') {
      throw new Error(response?.responseMessage);
    }
    modalStatusRef.value?.show({
      status: 'success',
      title: `${isGotTip.value ? 'Update tip' : 'Add tip'} success!`,
      afterClose: () => router.back(),
    });
  } catch (error: any) {
    handleError({error});
  } finally {
    isUpdateLoading.value = false;
  }
};
const isGotTip = computed(() => historyDetail.value?.amountInformation?.tipAmount !== '0');
</script>

<style scoped lang="scss">
:deep {
  .tip-input {
    background-color: #f2f7ff;
    border: 1px solid #2d65ef;
    color: #828282;
  }
}
</style>
