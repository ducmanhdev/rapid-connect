<template>
  <a-modal v-model:visible="isVisible" :footer="false" :width="552" title="Void information" centered>
    <a-form
      ref="formRef"
      layout="vertical"
      :model="formState"
      :rules="formRules"
      @finish="handleFinish"
      class="child:!mb-0 space-y-7"
    >
      <a-form-item label="Enter transaction number" name="transaction">
        <a-input v-model:value="formState.transaction" />
      </a-form-item>
      <a-form-item label="Enter order id" name="reference">
        <a-input v-model:value="formState.reference" />
      </a-form-item>
      <a-form-item>
        <div class="grid grid-cols-2 gap-3 max-w-[398px] mx-auto">
          <a-button type="ghost" danger @click="hide">Cancel</a-button>
          <a-button type="primary" html-type="submit">OK</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from 'vue';
const emits = defineEmits<{
  (e: 'void', data: {transaction: string; reference: string}): void;
}>();
const formState = ref({
  transaction: '',
  reference: '',
});
const formRules = ref({
  transaction: [{required: true, message: 'Please input transaction!'}],
  reference: [{required: true, message: 'Please order ID!'}],
});
const handleFinish = () => {
  emits('void', {...formState.value});
  hide();
};
const isVisible = ref(false);
const show = () => (isVisible.value = true);
const hide = () => (isVisible.value = false);
defineExpose({
  show,
  hide,
});
</script>

<style lang="scss"></style>
