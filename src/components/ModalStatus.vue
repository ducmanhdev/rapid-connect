<template>
  <a-modal
    v-model:visible="isVisible"
    :footer="false"
    :width="552"
    :closable="false"
    :maskClosable="status !== 'loading'"
    :keyboard="status !== 'loading'"
    centered
    wrap-class-name="modal-status"
    :after-close="handleAfterHide"
  >
    <img class="block mx-auto mb-5" :src="getImageUrl('card-1.svg')" alt="" v-if="status === 'loading'" />
    <img class="block mx-auto mb-5" :src="getImageUrl('card-2.svg')" alt="" v-else-if="status === 'success'" />

    <img class="block mx-auto mb-3" :src="getImageUrl('loading.svg')" alt="" v-if="status === 'loading'" />
    <img class="block mx-auto mb-3" :src="getImageUrl('success.svg')" alt="" v-else-if="status === 'success'" />

    <h3 class="font-semibold text-lg mb-1" v-if="title">{{ title }}</h3>
    <p class="mb-0" v-if="describe">{{ describe }}</p>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {getImageUrl} from '@/utils/url';

export interface ShowI {
  status: 'loading' | 'success';
  title?: string;
  describe?: string;
  afterClose?: () => any;
}

const isVisible = ref(false);
const status = ref('loading');
const title = ref('');
const describe = ref('');
const handleAfterHide = ref(() => {});
const show = async (payload: ShowI) => {
  if (isVisible.value) {
    isVisible.value = false;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // reset
  status.value = 'loading';
  title.value = '';
  describe.value = '';
  handleAfterHide.value = () => {};

  isVisible.value = true;
  status.value = payload.status;
  title.value = payload.title || '';
  describe.value = payload.describe || '';
  handleAfterHide.value = payload.afterClose || (() => {});
};
const hide = () => {
  isVisible.value = false;
};
defineExpose({
  show,
  hide,
});
</script>

<style lang="scss">
.modal-status {
  .ant-modal-body {
    padding: 2rem;
    text-align: center;
  }
}
</style>
