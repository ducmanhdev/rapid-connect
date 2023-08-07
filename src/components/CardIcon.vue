<template>
  <img :src="iconSrc" alt="" />
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {CARD_TYPE} from 'pax-ts';
import {getImageUrl} from '@/utils/url';

const props = defineProps<{
  code: string;
}>();
const iconSrc = computed(() => {
  switch (props.code) {
    case CARD_TYPE.VISA: {
      return getImageUrl('payment-methods/visa.svg');
    }
    case CARD_TYPE.AMEX: {
      return getImageUrl('payment-methods/amex.svg');
    }
    case CARD_TYPE.DISCOVER: {
      return getImageUrl('payment-methods/discover.svg');
    }
    case CARD_TYPE.JCB: {
      return getImageUrl('payment-methods/jcb.svg');
    }
    case CARD_TYPE.MASTERCARD: {
      return getImageUrl('payment-methods/mastercard.svg');
    }
    default: {
      return '';
    }
  }
});
</script>

<style scoped></style>
