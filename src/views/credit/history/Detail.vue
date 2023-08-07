<template>
  <section class="card grow p-0">
    <div class="divide-y child:p-4 md:child:py-5 md:child:px-[30px]">
      <div class="grid grid-cols-[1fr_30px] gap-2 py-3.5 px-5 justify-items-center">
        <button type="button" class="flex items-center w-full" @click="router.back()">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          History Details
        </button>
        <button type="button" @click="handleReload">
          <img src="@/assets/images/icon-refresh.svg" alt="" />
        </button>
      </div>
      <base-loading v-if="isGetHistoryDetailLoading"></base-loading>
      <a-empty v-else-if="!historyDetail"></a-empty>
      <template v-else>
        <div class="!p-0 child:p-4 md:child:py-5 md:child:px-[30px]">
          <div class="grid grid-cols-1 min-[430px]:grid-cols-[auto_auto] md:grid-cols-[120px_1fr_200px] gap-3">
            <div class="font-semibold text-lg">
              {{ +historyDetail?.paymentType === +TRANS_TYPE.RETURN ? 'Refund' : 'Payment' }}
            </div>
            <div class="max-md:order-3 max-md:col-span-2">
              <div class="space-y-2">
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div>
                    {{ dayjs(timestampToDate(historyDetail?.traceInformation.timeStamp)).format('MMMM DD, YYYY') }}
                  </div>
                  <div>{{ dayjs(timestampToDate(historyDetail?.traceInformation.timeStamp)).format('h:mm:ss A') }}</div>
                </div>
                <div>
                  <span
                    class="tag"
                    :class="[
                      historyDetail.hostInformation.hostResponseMessage === 'APPROVED' ? 'tag--success' : 'tag--error',
                    ]"
                  >
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
                    {{
                      +historyDetail?.paymentType === +TRANS_TYPE.SALE
                        ? historyDetail?.hostInformation?.hostResponseMessage === 'APPROVED'
                          ? 'Payment successful'
                          : 'Payment fail'
                        : historyDetail?.hostInformation?.hostResponseMessage === 'APPROVED'
                        ? 'Refund successful'
                        : 'Refund fail'
                    }}
                  </span>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">Tender:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">Card details:</div>
                  <div>
                    {{ reverseObject(CARD_TYPE)[historyDetail?.accountInformation?.cardType] }}
                    {{ historyDetail?.accountInformation?.account }}
                  </div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">Employee:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">Transaction#:</div>
                  <div>{{ historyDetail?.traceInformation?.transactionNumber }}</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">Device ID:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">Application:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">Payment ID:</div>
                  <div>{{ historyDetail?.traceInformation?.referenceNumber }}</div>
                </div>
              </div>
              <div class="mt-6">
                <button
                  type="button"
                  class="inline-block bg-[#D96425] text-white rounded px-3 py-1 font-medium"
                  @click="handleToggleDetail"
                >
                  {{ isShowDetail ? 'Hide Details' : 'Details' }}
                </button>
              </div>
              <div class="mt-6 space-y-2" v-if="isShowDetail">
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">Entry Method:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">History Type:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">History State:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">MID:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">AUTH:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">REF:</div>
                  <div>-</div>
                </div>
                <div class="grid grid-cols-[140px_auto] gap-3">
                  <div class="text-C82">CVM:</div>
                  <div>-</div>
                </div>
              </div>
            </div>
            <div class="self-start flex items-center justify-end">
              <div class="text-lg font-semibold text-right">
                {{
                  currencyFormatter(
                    (historyDetail?.amountInformation?.approveAmount - historyDetail?.amountInformation?.tipAmount) /
                      100
                  )
                }}
              </div>
              <button type="button" class="btn ml-3" @click="handleReceipt">RECEIPTS</button>
            </div>
          </div>
          <div class="grid grid-cols-[auto_auto] justify-between gap-3" v-if="isGotTip">
            <div class="font-semibold text-lg">Tip</div>
            <div class="flex items-center justify-end">
              <div class="text-lg font-semibold text-right">
                {{ currencyFormatter(historyDetail?.amountInformation?.tipAmount / 100) }}
              </div>
              <button
                type="button"
                class="btn ml-3"
                @click="handleEditTip"
                :disabled="
                  !isGotTip ||
                  +historyDetail?.paymentType === +TRANS_TYPE.RETURN ||
                  historyDetail?.voidHistory?.length > 0 ||
                  !!route?.params?.batchTimestamp
                "
              >
                EDIT
              </button>
            </div>
          </div>
        </div>
        <template v-if="historyDetail?.voidHistory?.length > 0">
          <div
            class="grid grid-cols-[auto_auto] md:grid-cols-[120px_1fr_200px] gap-3"
            v-for="voidItem in historyDetail.voidHistory"
            :key="voidItem.traceInformation.transactionNumber"
          >
            <div class="font-semibold text-lg">Void</div>
            <div class="space-y-2 max-md:order-3 max-md:col-span-2">
              <div class="grid grid-cols-[140px_auto] gap-3">
                <div>{{ dayjs(timestampToDate(voidItem?.traceInformation?.timeStamp)).format('MMMM DD, YYYY') }}</div>
                <div>{{ dayjs(timestampToDate(voidItem?.traceInformation?.timeStamp)).format('h:mm:ss A') }}</div>
              </div>
              <div>
                <span class="tag tag--error">
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
                  {{
                    voidItem?.hostInformation?.hostResponseMessage === 'APPROVED' ? 'Void successful' : 'Void failed'
                  }}
                </span>
              </div>
              <div class="grid grid-cols-[140px_auto] gap-3">
                <div class="text-C82">Tender:</div>
                <div>-</div>
              </div>
              <div class="grid grid-cols-[140px_auto] gap-3">
                <div class="text-C82">Employee:</div>
                <div>-</div>
              </div>
              <div class="grid grid-cols-[140px_auto] gap-3">
                <div class="text-C82">Transaction#:</div>
                <div>{{ voidItem?.traceInformation?.transactionNumber }}</div>
              </div>
              <div class="grid grid-cols-[140px_auto] gap-3">
                <div class="text-C82">Device ID:</div>
                <div>-</div>
              </div>
              <div class="grid grid-cols-[140px_auto] gap-3">
                <div class="text-C82">Refund ID:</div>
                <div>{{ voidItem?.traceInformation?.referenceNumber }}</div>
              </div>
            </div>
            <div class="text-lg text-CEC font-semibold text-right">
              -{{
                currencyFormatter(
                  (voidItem?.amountInformation?.approveAmount - voidItem?.amountInformation?.tipAmount) / 100
                )
              }}
            </div>
          </div>
        </template>
        <div class="grid grid-cols-[auto_auto] md:grid-cols-[120px_1fr] gap-3 items-center" v-if="refundAmount">
          <div class="font-semibold text-lg">Refund:</div>
          <div class="font-semibold text-2xl max-md:text-right text-CEC">
            -{{ currencyFormatter(refundAmount / 100) }}
          </div>
        </div>
        <div class="grid grid-cols-[auto_auto] md:grid-cols-[120px_1fr] gap-3 items-center">
          <div class="font-semibold text-lg">Total:</div>
          <div class="font-semibold text-2xl max-md:text-right">
            {{ currencyFormatter(totalAmount / 100) }}
          </div>
        </div>
        <div class="">
          <div class="grid grid-cols-2 gap-3 max-w-[398px]">
            <a-button
              type="ghost"
              danger
              @click="handleEnterRefundAmount"
              :disabled="
                isRefundLoading ||
                isGetHistoryDetailLoading ||
                +historyDetail?.paymentType === +TRANS_TYPE.RETURN ||
                historyDetail?.voidHistory?.length > 0 ||
                totalAmount <= 0 ||
                !route?.params?.batchTimestamp
              "
              >{{ isRefundLoading ? 'Refunding...' : 'Refund' }}
            </a-button>
            <a-button
              type="primary"
              @click="handleAddTip"
              :disabled="
                isGotTip ||
                isGetHistoryDetailLoading ||
                +historyDetail?.paymentType === +TRANS_TYPE.RETURN ||
                historyDetail?.voidHistory?.length > 0 ||
                !!route?.params?.batchTimestamp
              "
              >Add tip
            </a-button>
          </div>
        </div>
      </template>
    </div>
  </section>
  <modal-refund ref="modalRefundRef" :total="totalAmount" @confirm-refund="handleRefund"></modal-refund>
  <modal-confirm ref="modalConfirmRef"></modal-confirm>
  <modal-status ref="modalStatusRef"></modal-status>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import handleError from '@/utils/error';
import BaseLoading from '@/components/BaseLoading.vue';
import {useRoute, useRouter} from 'vue-router';
import {useGeneralStore} from '@/stores/general';
import {CARD_TYPE, TRANS_TYPE} from 'pax-ts';
import {reverseObject} from '@/utils/transform';
import dayjs from 'dayjs';
import {currencyFormatter, timestampToDate} from '@/utils/format';
import ModalRefund from '@/components/ModalRefund.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import ModalStatus from '@/components/ModalStatus.vue';
import {useHistoryStore} from '@/stores/history';

const router = useRouter();
const route = useRoute();
const generalStore = useGeneralStore();
const historyStore = useHistoryStore();
const historyDetail = ref<any>(null);
const isGetHistoryDetailLoading = ref(false);
const handleGetHistoryDetail = async () => {
  try {
    isGetHistoryDetailLoading.value = true;
    historyDetail.value = await historyStore.getHistoryDetail({
      referenceNumber: route.params.referenceNumber as string,
      batchTimestamp: route.params.batchTimestamp as string,
    });
  } catch (error: any) {
    handleError({error});
  } finally {
    isGetHistoryDetailLoading.value = false;
  }
};
handleGetHistoryDetail();

const handleAddTip = () => {
  router.push({
    name: 'credit-history-detail-edit-tip',
    params: {
      referenceNumber: historyDetail.value.traceInformation.referenceNumber,
    },
  });
};
const handleEditTip = handleAddTip;

const handleReceipt = () => {
  router.push({
    name: 'credit-history-detail-receipt',
    params: route.params,
  });
};
const modalRefundRef = ref<InstanceType<typeof ModalRefund> | null>(null);
const handleEnterRefundAmount = () => {
  modalRefundRef.value?.show();
};
const modalConfirmRef = ref<InstanceType<typeof ModalConfirm> | null>(null);
const modalStatusRef = ref<InstanceType<typeof ModalStatus> | null>();
const isRefundLoading = ref(false);
const handleRefund = async (refundAmount: number) => {
  try {
    await modalConfirmRef.value?.show({
      title: 'Confirm Refund',
      describe: `Are you sure you want to issue refund ${currencyFormatter(refundAmount)}?`,
    });
    modalStatusRef.value?.show({
      status: 'loading',
      title: 'Refund',
      describe: 'Waiting for ...',
    });
    isRefundLoading.value = true;
    const response = await generalStore.pax?.doReturn({
      amount: refundAmount * 100,
      orderId: historyDetail.value?.traceInformation?.referenceNumber,
    });
    if (response?.responseMessage !== 'OK') {
      modalStatusRef.value?.hide();
      throw new Error(response?.responseMessage);
    }
    modalStatusRef.value?.show({
      status: 'success',
      title: 'Refund success',
      afterClose: handleGetHistoryDetail,
    });
  } catch (error: any) {
    handleError({error});
  } finally {
    isRefundLoading.value = false;
  }
};

const isShowDetail = ref(false);
const handleToggleDetail = () => {
  isShowDetail.value = !isShowDetail.value;
};
const isGotTip = computed(() => historyDetail.value?.amountInformation?.tipAmount !== '0');
const refundAmount = computed(() => {
  if (!historyDetail.value?.refundHistory) return 0;
  return historyDetail.value?.refundHistory.reduce(
    (accumulator: number, refundItem: any) => accumulator + Number(refundItem?.amountInformation?.approveAmount),
    0
  );
});
const totalAmount = computed(() => historyDetail.value?.amountInformation.approveAmount - refundAmount.value);
const handleReload = () => {
  handleGetHistoryDetail();
};
</script>

<style scoped lang="scss"></style>
