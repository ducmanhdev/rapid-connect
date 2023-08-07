<template>
  <section class="card grow md:grid md:grid-cols-[6fr_4fr] gap-3">
    <numpad v-model="value"></numpad>
    <a-button type="primary" block class="mt-4 md:mt-14 !h-14" :disabled="isEmptyValue" @click="handleRefund"
      >Refund
    </a-button>
  </section>
  <modal-status ref="modalStatusRef"></modal-status>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import Numpad from '@/components/Numpad.vue';
import handleError from '@/utils/error';
import {useGeneralStore} from '@/stores/general';
import ModalStatus from '@/components/ModalStatus.vue';
import {useRouter} from 'vue-router';
const router = useRouter();
const generalStore = useGeneralStore();
const modalStatusRef = ref<InstanceType<typeof ModalStatus> | null>(null);
const value = ref(0);
const isEmptyValue = computed(() => !value.value);
const handleRefund = async () => {
  try {
    if (!generalStore.isPaxConnected) {
      throw new Error(`No pax is connected yet!`);
    }
    modalStatusRef.value?.show({
      status: 'loading',
      title: 'Refund',
      describe: 'Waiting for ...',
    });
    const response: any = await generalStore.pax?.doReturn({
      amount: Number(value.value) * 100,
    });
    if (response?.responseMessage !== 'OK') {
      modalStatusRef.value?.hide();
      throw new Error(response?.responseMessage);
    }
    modalStatusRef.value?.show({
      status: 'success',
      title: 'Refund',
      describe: 'Refund successful!',
      afterClose: () => {
        router.push({
          name: 'home',
        });
      },
    });
  } catch (error: any) {
    handleError({error});
  }
};
</script>

<style scoped></style>
