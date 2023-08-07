<template>
  <teleport to="body">
    <transition name="slide-up" @after-enter="handleAfterEnter" @leave="handleLeave">
      <div
        v-if="isVisible"
        class="sticky bottom-0 inset-x-0 bg-CF0 p-7 z-[9999] drop-shadow-[-6px_0_8px_rgba(0,0,0,0.15)]"
        ref="numpadRef"
      >
        <div
          :class="`
          w-[380px] grid grid-cols-3 gap-3.5 mx-auto text-center font-semibold text-2xl
          child:select-none child:p-2 child:h-[50px] child:rounded-lg child:flex child:items-center child:justify-center child:drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] child:cursor-pointer
          child-active:drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]`"
        >
          <div v-for="num in 9" :key="num" class="bg-white text-black" @click="handleAdd(num.toString())">
            {{ num }}
          </div>
          <div class="bg-white text-black" @click="handleAdd('00')">00</div>
          <div class="bg-white text-black" @click="handleAdd('0')">0</div>
          <div class="bg-white text-black" @click="handleDel">Del</div>
          <div class="bg-error text-white" @click="handleClear">Clear</div>
          <div class="col-span-2 bg-primary text-white" @click="handleOk">OK</div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useNumpadStore} from '@/stores/numpad';

const numpadStore = useNumpadStore();

const isVisible = computed(() => numpadStore.isVisible);
const {handleAdd, handleDel, handleClear, handleOk} = numpadStore;

const numpadRef = ref<null | HTMLElement>(null);
const handleClickOutside = async (event: any) => {
  if (!isVisible.value || numpadRef.value?.contains(event.target) || numpadStore.triggerTarget?.contains(event.target))
    return;
  numpadStore.handleHide();
};
const handleAfterEnter = () => {
  document.addEventListener('click', handleClickOutside);
};
const handleLeave = () => {
  document.removeEventListener('click', handleClickOutside);
};
</script>

<style scoped></style>
