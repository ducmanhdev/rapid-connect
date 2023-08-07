<template>
  <section class="card grow md:grid md:grid-cols-[6fr_4fr] gap-3">
    <numpad v-model="value"></numpad>
    <a-button type="primary" block class="mt-4 md:mt-14 !h-14" :disabled="isEmptyValue" @click="handleSale"
      >SALE
    </a-button>
  </section>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import Numpad from '@/components/Numpad.vue';
import {useRouter} from 'vue-router';
import {usePaymentStore} from '@/stores/payment';

const paymentStore = usePaymentStore();
const router = useRouter();
const value = ref(0);
const isEmptyValue = computed(() => !value.value);
const handleSale = () => {
  paymentStore.payValue = value.value;
  router.push({
    name: 'credit-sale-tip',
  });
};
</script>

<style scoped></style>
