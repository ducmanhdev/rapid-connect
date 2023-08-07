<template>
  <a-modal v-model:visible="isVisible" :footer="false" :width="720" centered title="Scan">
    <h3 class="text-center font-bold text-xl">List device in network</h3>
    <base-loading v-if="isScanLoading"></base-loading>
    <ul v-else-if="listDevice?.length" class="mb-0 space-y-2 text-base">
      <li
        v-for="device in listDevice"
        :key="device.ip"
        @click="handleSelect(device.ip)"
        class="px-4 py-2 shadow-sm rounded border cursor-pointer hover:border-primary flex items-center justify-between gap-3"
      >
        <span>IP: {{ device.ip }}</span>
        <span class="text-secondary text-sm">{{ device.SN ? `(SN: ${device.SN})` : '' }}</span>
      </li>
    </ul>
    <a-empty v-else></a-empty>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import BaseLoading from '@/components/BaseLoading.vue';
import {gapMiniAppSdk} from '@/sdk';
import handleError from '@/utils/error';
import {jsonToObject} from '@/utils/json';
import {useGeneralStore} from '@/stores/general';
import Pax from 'pax-ts';

const generalStore = useGeneralStore();
const emits = defineEmits<{
  (e: 'select', ip: string): void;
}>();

const listDevice = ref<any[]>([]);
const isVisible = ref(false);
const isScanLoading = ref(true);
const handleScan = async (port: number) => {
  try {
    listDevice.value = [];
    isScanLoading.value = true;
    if (!generalStore.isGapMiniAppSdkReady()) {
      throw new Error('GapMiniAppSdk is not ready!');
    }
    const networkStatus: any = await gapMiniAppSdk.getInstance().getNetworkStatus();
    let wifiGateway = networkStatus.wifiGateway?.split('.').slice(0, -1).join('.');
    if (!wifiGateway || wifiGateway === '0.0.0') {
      wifiGateway = null;
    }
    const networkDevice: any = await gapMiniAppSdk.getInstance().scanNetworkDevice({
      ip: wifiGateway,
      port: port,
    });

    const PAX_PORT = 10009;
    if (port === PAX_PORT) {
      const scanPromise = await Promise.allSettled(
        (jsonToObject(networkDevice)?.list || []).map(async ({ip}: any) => {
          const pax = new Pax({
            ip: ip,
            port: port,
            miniApp: gapMiniAppSdk.getInstance(),
          });
          const res = await pax.doInitialize();
          return {
            ip: ip,
            SN: res?.paxInfoResponse?.SN,
          };
        })
      );
      listDevice.value = scanPromise.filter((item: any) => item.status === 'fulfilled').map((item: any) => item.value);
      return;
    }
    listDevice.value = jsonToObject(networkDevice)?.list || [];
  } catch (error) {
    handleError({error});
  } finally {
    isScanLoading.value = false;
  }
};
const handleSelect = (ip: string) => {
  emits('select', ip);
  hide();
};
const show = (port: number) => {
  isVisible.value = true;
  handleScan(port);
};
const hide = () => (isVisible.value = false);
defineExpose({
  show,
  hide,
});
</script>

<style lang="scss"></style>
