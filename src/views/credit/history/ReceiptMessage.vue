<template>
  <section class="card grow p-0">
    <div class="divide-y child:py-5 child:px-[30px]">
      <div class="grid grid-cols-[1fr_30px_30px] gap-2 py-3.5 px-5 justify-items-center">
        <div class="flex items-center w-full">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          Message
        </div>
      </div>
      <div class="">
        <a-form
          ref="formRef"
          layout="vertical"
          :model="formState"
          :rules="formRules"
          @finish="handleFinish"
          class="child:!mb-0 space-y-7"
        >
          <a-form-item label="Enter your phone number" name="phone">
            <a-input v-model:value="formState.phone" placeholder="Phone number" v-maska data-maska="(+##) ####-####" />
            <p class="mt-4 mb-0">
              To send to an international number , use the + sign and country code prefix, such as +42
            </p>
          </a-form-item>
          <a-form-item>
            <div class="grid grid-cols-2 gap-3 max-w-[398px] mx-auto">
              <a-button type="ghost" danger @click="handleCancel">Cancel</a-button>
              <a-button type="primary" html-type="submit" :disabled="!isReadySubmit">Done</a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import type {Rule} from 'ant-design-vue/es/form';
import {z} from 'zod';

const formState = ref({
  phone: '',
});

const isPhoneNumber = (value: string) => {
  return z
    .custom((val) => /\(\+\d{2}\) \d{4}-\d{4}/.test(val as string), {
      message: 'Invalid phone number',
    })
    .safeParse(value);
};
const phoneValidator = async (_rule: Rule, value: string) => {
  const result = isPhoneNumber(value);
  if (!result.success) {
    const formatted = result.error.format();
    return Promise.reject(formatted._errors[0]);
  }
  return Promise.resolve();
};
const formRules = ref({
  phone: [{validator: phoneValidator}],
});

const isReadySubmit = computed(() => {
  const result = isPhoneNumber(formState.value.phone);
  return result.success;
});
const handleFinish = () => {};
const handleCancel = () => {};
</script>

<style scoped lang="scss"></style>
