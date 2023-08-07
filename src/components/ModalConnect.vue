<template>
  <a-modal v-model:visible="isVisible" :footer="false" :width="720" centered title="Connect with" class="modal-connect">
    <div class="grid grid-cols-[repeat(2,auto)] gap-4 mb-6">
      <button
        type="button"
        v-for="[key, value] in Object.entries(LIST_TAB)"
        :key="key"
        @click="tabActive = value"
        class="rounded bg-CE9 text-C82 p-2.5 text-center font-medium"
        :class="{
          '!bg-C1F !text-white !font-semibold': value === tabActive,
        }"
      >
        {{ value }}
      </button>
    </div>
    <div>
      <a-form
        v-if="tabActive === LIST_TAB.PAX"
        :model="paxModel"
        :rules="paxRules"
        :label-col="{span: 24, md: {span: 2}}"
        :wrapper-col="{span: 24, md: {span: 22}}"
        autocomplete="off"
        @finish="handleConnectPax"
        class="child:mb-0 space-y-3"
      >
        <a-form-item label="IP:" name="ip">
          <a-input v-model:value="paxModel.ip" />
        </a-form-item>
        <a-form-item label="Port:" name="port">
          <a-input v-model:value="paxModel.port" />
        </a-form-item>
        <a-form-item :wrapper-col="{offset: 0, span: 24, md: {offset: 2, span: 22}}">
          <div class="grid grid-cols-2 gap-2">
            <a-button type="primary" ghost @click="handleScan">Scan</a-button>
            <a-button type="primary" html-type="submit" :disabled="isConnectPaxLoading"
              >{{ isConnectPaxLoading ? 'Connecting...' : 'Connect' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
      <a-form
        v-if="tabActive === LIST_TAB.PRINT"
        :model="printModel"
        :rules="printRules"
        :label-col="{span: 24, md: {span: 2}}"
        :wrapper-col="{span: 24, md: {span: 22}}"
        autocomplete="off"
        @finish="handleConnectPrint"
        class="child:mb-0 space-y-3"
      >
        <a-form-item label="IP:" name="ip">
          <a-input v-model:value="printModel.ip" />
        </a-form-item>
        <a-form-item :wrapper-col="{offset: 0, span: 24, md: {offset: 2, span: 22}}">
          <div class="grid grid-cols-2 gap-2">
            <a-button type="primary" ghost @click="handleScan">Scan</a-button>
            <a-button type="primary" html-type="submit">Connect</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
  <modal-scan ref="modalScanRef" @select="handleSelectDevice"></modal-scan>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useGeneralStore} from '@/stores/general';
import handleError from '@/utils/error';
import type {Rule} from 'ant-design-vue/es/form';
import {z} from 'zod';
import {notification} from 'ant-design-vue';
import ModalScan from '@/components/ModalScan.vue';
import {db} from '@/database';

const generalStore = useGeneralStore();

const LIST_TAB = {
  PAX: 'Pax',
  PRINT: 'Print',
};
const tabActive = ref(LIST_TAB.PAX);

const paxModel = ref({
  ip: '',
  port: 10009,
});

const IpValidator = async (_rule: Rule, value: string) => {
  const result = z.string().ip().safeParse(value);
  return !result.success ? Promise.reject() : Promise.resolve();
};
const paxRules = ref({
  ip: [{required: true, validator: IpValidator, message: 'Invalid IP!'}],
  port: [{required: true, message: 'Invalid port!'}],
});

const isConnectPaxLoading = ref(false);
const handleConnectPax = async () => {
  try {
    isConnectPaxLoading.value = true;
    await generalStore.connectPax(paxModel.value);
    notification.success({
      message: 'Connect success',
    });
    hide();
    await db.listBatchClose.clear();
  } catch (error) {
    handleError({error});
  } finally {
    isConnectPaxLoading.value = false;
  }
};

const printModel = ref({
  ip: '',
  port: 9100,
});
const printRules = ref({
  ip: [{required: true, message: 'Please input ip!'}],
});
const isConnectPrintLoading = ref(false);
const handleConnectPrint = async () => {
  try {
    isConnectPrintLoading.value = true;
    await generalStore.connectPrinter(printModel.value);
    notification.success({
      message: 'Connect success',
    });
    hide();
  } catch (error) {
    console.error(error);
  } finally {
    isConnectPrintLoading.value = false;
  }
};
const isVisible = ref(false);
const show = () => {
  paxModel.value = {
    ip: '',
    port: 10009,
  };
  printModel.value = {
    ip: '',
    port: 9100,
  };
  isConnectPaxLoading.value = false;
  isVisible.value = true;
};
const hide = () => (isVisible.value = false);

const handleSelectDevice = async (ip: string) => {
  if (tabActive.value === LIST_TAB.PAX) {
    paxModel.value.ip = ip;
    handleConnectPax();
  } else if (tabActive.value === LIST_TAB.PRINT) {
    printModel.value.ip = ip;
    handleConnectPrint();
  }
};

const modalScanRef = ref<InstanceType<typeof ModalScan> | null>(null);
const handleScan = () => {
  const port = tabActive.value === LIST_TAB.PAX ? paxModel.value.port : printModel.value.port;
  modalScanRef.value?.show(port);
};

defineExpose({
  show,
  hide,
});
</script>

<style lang="scss">
.modal-connect {
  .ant-modal-body {
    @media (min-width: 640px) {
      padding: 1.75rem 4.75rem 2.5rem;
    }
  }
}
</style>
