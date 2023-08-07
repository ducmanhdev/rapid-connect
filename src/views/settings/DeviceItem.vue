<template>
  <div class="bg-white text-black grid grid-cols-5 gap-3 py-4 px-5 cursor-pointer text-center">
    <div>{{ device?.name }}</div>
    <div>{{ device?.serialNumber }}</div>
    <div>{{ device?.ip }}</div>
    <div>{{ device?.port }}</div>
    <div @click="handleToggleConnect(device)" :class="{'pointer-events-none opacity-50': isToggleConnectLoading}">
      <span class="tag tag--success" v-if="device?.isConnected">
        <svg
          class="shrink-0 mr-1"
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.6667 4L5.25004 10.4167L2.33337 7.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ isToggleConnectLoading ? 'Loading...' : 'Connected' }}
      </span>
      <span class="tag tag--error" v-else>
        <svg
          class="shrink-0 mr-1"
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.6667 4L5.25004 10.4167L2.33337 7.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ isToggleConnectLoading ? 'Loading...' : 'Disconnect' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useGeneralStore} from '@/stores/general';
import handleError from '@/utils/error';

const generalStore = useGeneralStore();
const props = defineProps<{
  device: any;
}>();

const isToggleConnectLoading = ref(false);
const handleToggleConnect = async (device: any) => {
  try {
    isToggleConnectLoading.value = true;
    await generalStore.toggleConnect(device);
  } catch (error: any) {
    handleError({error});
  } finally {
    isToggleConnectLoading.value = false;
  }
};
</script>

<style scoped></style>
