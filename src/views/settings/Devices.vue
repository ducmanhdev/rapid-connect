<template>
  <section class="card grow p-0">
    <div class="divide-y">
      <div class="grid grid-cols-[1fr_30px] gap-2 py-3.5 px-5 justify-items-center px-[30px] py-5">
        <router-link :to="{name: 'settings'}" type="button" class="flex items-center w-full text-inherit">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          Settings
        </router-link>
        <button type="button" @click="handleReload">
          <img src="@/assets/images/icon-refresh.svg" alt="" />
        </button>
      </div>
      <div class="overflow-x-auto">
        <div class="min-w-[900px]">
          <div class="bg-primary-lighter grid grid-cols-5 gap-3 py-3 px-3.5 text-lg font-semibold text-center">
            <div>Name</div>
            <div>Serial number</div>
            <div>IP</div>
            <div>PORT</div>
            <div>Status</div>
          </div>
          <base-loading v-if="isGetListDeviceLoading"></base-loading>
          <div class="divide-y" v-else-if="listDevice?.length">
            <device-item v-for="device in listDevice" :key="device.ip" :device="device" />
          </div>
          <a-empty class="p-4" v-else></a-empty>
        </div>
      </div>
    </div>
    <div class="text-center mt-4">
      <a-button type="primary" class="min-w-[190px]" @click="handleOpenModalAddDevice">More</a-button>
    </div>
  </section>

  <modal-connect ref="modalConnectRef"></modal-connect>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import ModalConnect from '@/components/ModalConnect.vue';
import {useGeneralStore} from '@/stores/general';
import BaseLoading from '@/components/BaseLoading.vue';
import DeviceItem from '@/views/settings/DeviceItem.vue';

const generalStore = useGeneralStore();
const modalConnectRef = ref<InstanceType<typeof ModalConnect> | null>(null);
const handleOpenModalAddDevice = () => {
  modalConnectRef.value?.show();
};
const listDevice = computed(() => generalStore.listDevice);
const isGetListDeviceLoading = ref(false);
let timeout: any;
const handleReload = () => {
  isGetListDeviceLoading.value = true;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    isGetListDeviceLoading.value = false;
  }, 1000);
};
</script>

<style scoped></style>
