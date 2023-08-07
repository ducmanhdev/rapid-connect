<template>
  <div>
    <div class="text-4xl text-primary font-semibold text-center mb-4">{{ currencyFormatter(value) }}</div>
    <div
      :class="`
         grid grid-cols-3 gap-3.5 mx-auto text-center font-semibold text-2xl
         child:bg-white child:text-black child:select-none child:p-2 child:h-14 child:rounded-lg child:flex child:items-center child:justify-center child:border child:cursor-pointer
         child-active:bg-primary child-active:text-white`"
    >
      <div v-for="num in 9" :key="num" @click="handleAdd(num.toString())">
        {{ num }}
      </div>
      <div @click="handleAdd('00')">00</div>
      <div @click="handleAdd('0')">0</div>
      <div @click="handleDel">Del</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {currencyFormatter} from '@/utils/format';

const props = defineProps<{
  modelValue: number;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', newValue: number): void;
}>();
const value = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits('update:modelValue', newValue);
  },
});
const handleAdd = (num: string) => {
  const MAX_LENGTH_NUMBER = 14;
  if (value.value.toString().length >= MAX_LENGTH_NUMBER) return;
  value.value = Number(`${value.value || 0}` + num);
};
const handleDel = () => {
  value.value = Number(`${value.value || 0}`.substring(0, value.value.toString().length - 1));
};
</script>

<style scoped></style>
