<template>
  <section class="card grow p-0">
    <div class="divide-y child:py-5 child:px-[30px]">
      <div class="grid grid-cols-[1fr_30px_30px] gap-2 py-3.5 px-5 justify-items-center">
        <button
          type="button"
          class="flex items-center w-full"
          @click="router.back()"
        >
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          Receipt
        </button>
      </div>
      <div>
        <h2 class="text-lg font-semibold mb-0 w-[300px] text-center">RECEIPT</h2>
        <p class="w-[300px] text-center">Merchant/ Customer Receipt</p>
        <div class="mt-8">
          <table class="w-[300px]">
            <tbody>
              <!-- <tr v-for="item in 10" :key="item"> -->
              <tr>
                <td>{{ dayjs(timestampToDate(historyDetail?.traceInformation?.timeStamp)).format("MM/DD/YYYY") }}</td>
                <td class="text-right">{{ dayjs(timestampToDate(historyDetail?.traceInformation?.timeStamp)).format("hh:mm:ss") }}</td>
              </tr>
              <tr>
                <td>Transaction #:</td>
                <td class="text-right">{{ historyDetail?.traceInformation?.transactionNumber }}</td>
              </tr>
              <tr>
                <td>Card Type:</td>
                <td class="text-right">{{ reverseObject(CARD_TYPE)[historyDetail?.accountInformation?.cardType] }}</td>
              </tr>
              <tr>
                <td>Account:</td>
                <td class="text-right">************{{ historyDetail?.accountInformation?.account }}</td>
              </tr>
              <tr>
                <td>Entry:</td>
                <td class="text-right">{{ reverseObject(ENTRY_MODE)[historyDetail?.accountInformation?.entryMode.padStart(2, '0')] }}</td>
              </tr>
              <tr>
                <td>Payment ID:</td>
                <td class="text-right">{{ historyDetail?.traceInformation?.referenceNumber }}</td>
              </tr>
              <tr>
                <td>SUB TOTAL:</td>
                <td class="text-right">{{ currencyFormatter((historyDetail?.amountInformation?.approveAmount / 100) - (historyDetail?.amountInformation?.tipAmount / 100)) }}</td>
              </tr>
              <tr>
                <td>TIP:</td>
                <td class="text-right">{{ currencyFormatter(historyDetail?.amountInformation?.tipAmount / 100) }}</td>
              </tr>
              <tr>
                <td colspan="2" class="border-b border-black border-dashed pt-2"></td>
              </tr>
              <tr class="font-semibold">
                <td class="pt-2">TOTAL:</td>
                <td class="text-right pt-2">{{ currencyFormatter(historyDetail?.amountInformation?.approveAmount / 100) }}</td>
              </tr>
              <tr>
                <td>Ref. Number:</td>
                <td class="text-right">{{ historyDetail?.hostInformation?.hostReferenceNumber }}</td>
              </tr>
              <tr>
                <td>Auth. Code:</td>
                <td class="text-right">{{ historyDetail?.hostInformation?.authCode }}</td>
              </tr>
              <tr>
                <td>Response:</td>
                <td class="text-right">{{ historyDetail?.hostInformation?.hostResponseMessage }}</td>
              </tr>
              <tr>
                <td>TC:</td>
                <td class="text-right">{{ (historyDetail?.additionalInformationRaw[0]).slice(3) }}</td>
              </tr>
              <tr>
                <td>TVR:</td>
                <td class="text-right">{{ (historyDetail?.additionalInformationRaw[1]).slice(4) }}</td>
              </tr>
              <tr>
                <td>AID:</td>
                <td class="text-right">{{ (historyDetail?.additionalInformationRaw[2]).slice(4) }}</td>
              </tr>
              <tr>
                <td>TSI:</td>
                <td class="text-right">{{ (historyDetail?.additionalInformationRaw[3]).slice(4) }}</td>
              </tr>
              <tr>
                <td>ATC:</td>
                <td class="text-right">{{ (historyDetail?.additionalInformationRaw[4]).slice(4) }}</td>
              </tr>
              <tr>
                <td>APPLAB:</td>
                <td class="text-right">{{ (historyDetail?.additionalInformationRaw[5]).slice(7) }}</td>
              </tr>
              <tr>
                <td>APPN:</td>
                <td class="text-right">{{ (historyDetail?.additionalInformationRaw[6]).slice(6) }}</td>
              </tr>
              <tr>
                <td colspan="2" class="text-center text-[11px] pt-2">Cardholder acknowledges receipt of goods and obligations set forth by the cardholder's agreement with issuer.</td>
              </tr>
              <tr>
                <td colspan="2" class="border-b border-black border-dashed pt-2"></td>
              </tr>
              <tr>
                <td colspan="2" class="text-center pt-2">{{ historyDetail?.accountInformation?.cardHolder }}</td>
              </tr>
              <!-- <p class="text-center m-0">{{ historyDetail?.accountInformation?.cardHolder }}</p> -->
            </tbody>
          </table>
        </div>
        <div class="mt-6 w-[300px] text-center">
          <a-button type="primary" class="min-w-[190px]" @click="handlePrint">Print</a-button>
        </div>
      </div>
    </div>

    <a-modal v-model:visible="isModalVisible" :footer="false" :width="552" title="Error" centered>
      <div class="text-center">
        <h2 class="text-2xl font-semibold mb-2">OOPS!</h2>
        <h2 class="text-lg font-semibold mb-4">
          No printer device connected, <br />please connect in setting and try again!
        </h2>
        <div class="grid grid-cols-[repeat(auto-fill,190px)] justify-center gap-2">
          <a-button type="primary" ghost danger @click="isModalVisible = false">Cancel</a-button>
          <a-button type="primary" @click="router.push({name: 'settings-devices'})">Go to settings</a-button>
        </div>
      </div>
    </a-modal>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {useHistoryStore} from '@/stores/history';
import handleError from '@/utils/error';
import {useGeneralStore} from '@/stores/general';
import { currencyFormatter, timestampToDate } from "@/utils/format"
import dayjs from "dayjs"
import { reverseObject } from '@/utils/transform';
import { CARD_TYPE, ENTRY_MODE } from 'pax-ts';
import { printReceipt } from "@/utils/prints/printReceipt";

const historyStore = useHistoryStore();
const router = useRouter();
const route = useRoute();
const generalStore = useGeneralStore();

const isModalVisible = ref(false);
const handlePrint = async () => {
  try {
    if (!generalStore.isPrintDeviceConnected) {
      isModalVisible.value = true;
    }
    await printReceipt(historyDetail.value)
  } catch (error) {
    alert(error);
  }
};
const historyDetail = ref<any>(null);
const isGetHistoryDetailLoading = ref(false);
const handleGetHistoryDetail = async () => {
  try {
    if (
      historyStore?.historyDetail &&
      historyStore?.historyDetail?.traceInformation?.referenceNumber === route.params?.referenceNumber
    ) {
      historyDetail.value = historyStore?.historyDetail;
      return;
    }
    isGetHistoryDetailLoading.value = true;
    historyDetail.value = await historyStore.getHistoryDetail({
      referenceNumber: route.params.referenceNumber as string,
    });
  } catch (error: any) {
    handleError({error});
  } finally {
    isGetHistoryDetailLoading.value = false;
  }
};
handleGetHistoryDetail();

</script>

<style scoped lang="scss">
.custom_divider{
    width: 100%;
    border: 0.5px dashed #000;
    top: 5px;
}
</style>
