import {ref} from 'vue';
import {defineStore} from 'pinia';
import {useGeneralStore} from '@/stores/general';
import {TRANS_TYPE} from 'pax-ts';
import {db} from '@/database';

interface GetHistoryDetailRequest {
  referenceNumber: string;
  batchTimestamp?: string;
}

export const useHistoryStore = defineStore('historyStore', () => {
  let getListHistoryResolve: any;
  let isRunGetListHistoryLoop = false;
  const getListHistory = (batchTimestamp?: string) => {
    isRunGetListHistoryLoop = false;
    getListHistoryResolve && getListHistoryResolve([]);
    return new Promise(async (resolve, reject) => {
      getListHistoryResolve = resolve;
      let list: any;
      try {
        if (batchTimestamp) {
          const res: any = await db.listBatchClose.filter((item: any) => item.timestamp === batchTimestamp).first();
          if (!res) {
            throw new Error(`List transaction not found!`);
          }
          list = JSON.parse(res.list).map((item: any) => ({
            ...item,
            batchTimestamp: batchTimestamp,
          }));
        } else {
          const generalStore = useGeneralStore();
          let refNum = 1;
          const results = [];
          if (!generalStore.isPaxConnected) {
            throw new Error(`No pax is connected yet!`);
          }

          isRunGetListHistoryLoop = true;
          // eslint-disable-next-line no-constant-condition
          while (isRunGetListHistoryLoop) {
            const response = await generalStore.pax?.localDetailReport({
              refNum: String(refNum),
            });
            if (response?.responseMessage !== 'OK') {
              break;
            }
            results.push(response?.paxLocalDetailReport);
            refNum += 1;
          }
          list = results.sort((transactionA: any, transactionB: any) => {
            return transactionA?.traceInformation?.timeStamp - transactionB?.traceInformation?.timeStamp > 0 ? -1 : 1;
          });
        }
        getListHistoryResolve(list);
      } catch (error) {
        reject(error);
      }
    });
  };

  let getListHistoryRefundResolve: any;
  let isRunGetListHistoryRefundLoop = false;
  const getListHistoryRefund = (referenceNumber: string) => {
    isRunGetListHistoryRefundLoop = false;
    getListHistoryRefundResolve && getListHistoryRefundResolve([]);
    return new Promise(async (resolve, reject) => {
      try {
        getListHistoryRefundResolve = resolve;
        const generalStore = useGeneralStore();
        let recordNum = 0;
        const results = [];

        isRunGetListHistoryRefundLoop = true;
        // eslint-disable-next-line no-constant-condition
        while (isRunGetListHistoryRefundLoop) {
          const response = await generalStore.pax?.localDetailReport({
            recordNum: String(recordNum),
            ecrRefNum: referenceNumber,
            cardType: TRANS_TYPE.RETURN,
          });
          if (response?.responseMessage !== 'OK') {
            break;
          }
          results.push(response?.paxLocalDetailReport);
          recordNum += 1;
        }
        getListHistoryRefundResolve(results);
      } catch (error) {
        reject(error);
      }
    });
  };

  const historyDetail = ref<any>(null);
  let getListHistoryDetailResolve: any;
  let isRunGetHistoryDetailLoop = false;
  const getHistoryDetail = async ({referenceNumber, batchTimestamp}: GetHistoryDetailRequest) => {
    isRunGetHistoryDetailLoop = false;
    getListHistoryDetailResolve && getListHistoryDetailResolve(null);
    return new Promise(async (resolve, reject) => {
      try {
        getListHistoryDetailResolve = resolve;
        const generalStore = useGeneralStore();
        if (!generalStore.isPaxConnected) {
          throw new Error(`No pax is connected yet!`);
        }
        if (batchTimestamp) {
          const res: any = await db.listBatchClose.filter((item: any) => item.timestamp === batchTimestamp).first();
          if (!res) {
            throw new Error(`List transaction not found!`);
          }
          const _list = JSON.parse(res.list);
          historyDetail.value = _list.find(
            (transaction: any) =>
              transaction?.traceInformation?.referenceNumber === referenceNumber &&
              (+transaction.paymentType === +TRANS_TYPE.SALE || +transaction.paymentType === +TRANS_TYPE.RETURN)
          );
          if (+historyDetail.value.paymentType === +TRANS_TYPE.SALE) {
            historyDetail.value.refundHistory = await getListHistoryRefund(referenceNumber);
            historyDetail.value.voidHistory = _list.filter(
              (transaction: any) =>
                transaction?.traceInformation?.referenceNumber === referenceNumber &&
                Object.entries(TRANS_TYPE)
                  .filter(([key]) => key.startsWith('VOID'))
                  .map((item: [string, string]) => item[1])
                  .includes(transaction.paymentType.padStart(2, '0'))
            );
          }
        } else {
          let recordNum = 0;
          const results = [];

          isRunGetHistoryDetailLoop = true;
          // eslint-disable-next-line no-constant-condition
          while (isRunGetHistoryDetailLoop) {
            const response = await generalStore.pax?.localDetailReport({
              recordNum: String(recordNum),
              ecrRefNum: referenceNumber,
            });
            if (response?.responseMessage !== 'OK') {
              break;
            }
            results.push(response?.paxLocalDetailReport);
            recordNum += 1;
          }
          historyDetail.value = results.find(
            (transaction: any) =>
              +transaction.paymentType === +TRANS_TYPE.SALE ||
              +transaction.paymentType === +TRANS_TYPE.RETURN
          );
          if (+historyDetail.value.paymentType === +TRANS_TYPE.SALE) {
            historyDetail.value.voidHistory = results.filter((transaction: any) =>
              Object.entries(TRANS_TYPE)
                .filter(([key]) => key.startsWith('VOID'))
                .map((item: [string, string]) => item[1])
                .includes(transaction.paymentType.padStart(2, '0'))
            );
          }
        }
        getListHistoryDetailResolve(historyDetail.value);
      } catch (error) {
        reject(error);
      }
    });
  };
  return {
    getListHistory,
    historyDetail,
    getHistoryDetail,
  };
});
