import {ref} from 'vue';
import type {Ref} from 'vue';
import {defineStore} from 'pinia';

export const useNumpadStore = defineStore('numpadStore', () => {
  const isVisible = ref(false);
  let value: null | Ref<number> = null;
  const triggerTarget = ref<null | HTMLElement>(null);
  const handleShow = (bindValue: Ref<number>, el: HTMLElement) => {
    value = bindValue;
    triggerTarget.value = el;
    isVisible.value = true;
  };
  const handleHide = () => {
    value = null;
    isVisible.value = false;
  };
  const handleAdd = (num: string) => {
    const MAX_LENGTH_NUMBER = 14;
    if (!value || value.value.toString().length >= MAX_LENGTH_NUMBER) return;
    value.value = Number(`${value.value || 0}` + num);
  };
  const handleDel = () => {
    if (!value) return;
    value.value = Number(`${value.value || 0}`.substring(0, value.value.toString().length - 1));
  };
  const handleClear = () => {
    if (!value) return;
    value.value = 0;
  };
  const handleOk = () => {
    handleHide();
  };
  return {
    isVisible,
    triggerTarget,
    handleShow,
    handleHide,
    handleAdd,
    handleDel,
    handleClear,
    handleOk,
  };
});
