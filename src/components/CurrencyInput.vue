<template>
  <input class="currency-input" ref="inputRef" type="text" />
</template>

<script setup lang="ts">
import {watch, watchEffect} from 'vue';
import {useCurrencyInput} from 'vue-currency-input';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    hideDefaultKeyboard?: boolean;
  }>(),
  {
    modelValue: 0,
    hideDefaultKeyboard: false,
  }
);

const {inputRef, setValue} = useCurrencyInput({
  currency: 'USD',
  locale: 'en',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  hideNegligibleDecimalDigitsOnFocus: false,
  autoDecimalDigits: false,
  useGrouping: true,
  accountingSign: false,
  valueRange: {
    min: 0,
  },
});
watchEffect(() => {
  if (inputRef.value && props.hideDefaultKeyboard) {
    inputRef.value.setAttribute('inputmode', 'none');
  }
});
watch(
  () => props.modelValue,
  (value) => {
    setValue(value);
  }
);
</script>

<style lang="scss">
.currency-input {
  appearance: none;
  width: 100%;
  height: 40px;
  border: 1px solid transparent;
  background-color: #fff;
  color: #000;
  outline: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
}
</style>
