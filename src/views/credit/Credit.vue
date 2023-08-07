<template>
  <section class="card grow px-8 py-10">
    <div
      class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[repeat(5,120px)] gap-4 md:gap-x-4 md:gap-y-14 justify-between text-center font-medium text-base md:text-lg"
    >
      <button type="button" @click="item?.onClick" v-for="item in listMenu" :key="item.title" class="leading-snug">
        <img :src="getImageUrl(item.icon)" alt="" class="block mx-auto mb-2" />
        <span>{{ item.title }}</span>
      </button>
    </div>
  </section>
  <modal-enter-void-information ref="modalEnterVoidInformationRef" @void="handleVoid"></modal-enter-void-information>
  <modal-confirm ref="modalConfirmRef"></modal-confirm>
  <modal-status ref="modalStatusRef"></modal-status>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {getImageUrl} from '@/utils/url';
import ModalEnterVoidInformation from '@/components/ModalEnterVoidInformation.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import ModalStatus from '@/components/ModalStatus.vue';
import handleError from '@/utils/error';
import {useGeneralStore} from '@/stores/general';
import {useHistoryStore} from '@/stores/history';
import {db} from '@/database';
import {currencyFormatter} from '@/utils/format';
const router = useRouter();
const generalStore = useGeneralStore();
const historyStore = useHistoryStore();
const modalConfirmRef = ref<InstanceType<typeof ModalConfirm> | null>(null);
const modalStatusRef = ref<InstanceType<typeof ModalStatus> | null>(null);

const handleCheckIsPaxConnect = () => {
  if (!generalStore.isPaxConnected) {
    throw new Error(`No pax is connected yet!`);
  }
};
const handleSale = () => {
  router.push({
    name: 'credit-sale',
  });
};

const modalEnterVoidInformationRef = ref<InstanceType<typeof ModalEnterVoidInformation> | null>(null);
const handleShowVoidInformationModal = () => {
  modalEnterVoidInformationRef.value?.show();
};
const handleVoid = async ({transaction, reference}: {transaction: string; reference: string}) => {
  try {
    handleCheckIsPaxConnect();
    modalStatusRef.value?.show({
      status: 'loading',
      title: 'Void',
      describe: 'Waiting for ...',
    });
    const response: any = await generalStore.pax?.doVoid({
      reference: reference,
      transaction: transaction,
    });
    if (response?.responseMessage !== 'OK') {
      modalStatusRef.value?.hide();
      throw new Error(response?.responseMessage);
    }
    modalStatusRef.value?.show({
      status: 'success',
      title: 'Void',
      describe: 'Void successful!',
    });
  } catch (error: any) {
    handleError({error});
  }
};
const handleRefund = () => {
  router.push({
    name: 'credit-refund',
  });
};
const handleBatch = async () => {
  try {
    handleCheckIsPaxConnect();
    await modalConfirmRef.value?.show({
      title: 'Close batch',
      describe: 'Are you sure you want to close batch?',
    });
    await modalStatusRef.value?.show({
      status: 'loading',
      describe: 'Close batch loading!',
    });
    const listHistory: any = await historyStore.getListHistory();
    const response: any = await generalStore.pax?.doBatchClose();
    if (response?.responseMessage !== 'OK') {
      throw new Error(response?.responseMessage);
    }
    await db.listBatchClose.add({
      timestamp: response.paxBatchResponse.timestamp,
      creditCount: response.paxBatchResponse.batchCount.creditCount,
      creditAmount: response.paxBatchResponse.batchAmount.creditAmount,
      list: JSON.stringify(listHistory),
    });
    modalStatusRef.value?.show({
      status: 'success',
      describe: `Close batch successful! Total ${currencyFormatter(
        response.paxBatchResponse.batchAmount.creditAmount / 100
      )}`,
    });
  } catch (error: any) {
    handleError({error});
  } finally {
    modalStatusRef.value?.hide();
  }
};
const handleToHistory = () => {
  router.push({
    name: 'credit-history',
  });
};

interface Menu {
  icon: string;
  title: string;
  onClick: () => void;
}
const listMenu: Array<Menu> = [
  {
    icon: 'credit-icon-1.svg',
    title: 'Sale',
    onClick: handleSale,
  },
  {
    icon: 'credit-icon-2.svg',
    title: 'Void',
    onClick: handleShowVoidInformationModal,
  },
  {
    icon: 'credit-icon-3.svg',
    title: 'Refund',
    onClick: handleRefund,
  },
  {
    icon: 'credit-icon-4.svg',
    title: 'Batch',
    onClick: handleBatch,
  },
  {
    icon: 'credit-icon-5.svg',
    title: 'History',
    onClick: handleToHistory,
  },
  {
    icon: 'credit-icon-6.svg',
    title: 'Reports',
    onClick: () =>
      router.push({
        name: 'credit-reports',
      }),
  },
];
</script>

<style scoped lang="scss">
:deep {
  .ant-input-number-input {
    height: 46px;
  }
}
</style>
