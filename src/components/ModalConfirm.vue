<template>
  <a-modal v-model:visible="isVisible" :title="_title" :footer="false" :width="552" :closable="false" centered>
    <p class="mb-10">{{ _describe }}</p>
    <div class="grid grid-cols-2 gap-3 max-w-[398px] mx-auto">
      <a-button type="ghost" danger @click="handleCancel">{{ _cancelText }}</a-button>
      <a-button type="primary" @click="handleOk">{{ _okText }}</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const isVisible = ref(false);
const _title = ref<string>('');
const _describe = ref<string>('');
const _cancelText = ref<string>('');
const _okText = ref<string>('');
let handleResolve: ((value?: unknown) => void) | null = null;
let handleReject: (() => void) | null = null;

type ShowParams = {
  title: string;
  describe: string;
  cancelText?: string;
  okText?: string;
};
const show = ({title, describe, cancelText = 'Cancel', okText = 'OK'}: ShowParams) => {
  return new Promise((resolve, reject) => {
    _title.value = title;
    _describe.value = describe;
    _cancelText.value = cancelText;
    _okText.value = okText;
    handleResolve = resolve;
    handleReject = reject;
    isVisible.value = true;
  });
};
const handleCancel = () => {
  // handleReject!();
  hide();
};
const handleOk = () => {
  handleResolve!();
  hide();
};
const hide = () => (isVisible.value = false);
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
