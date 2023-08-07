import {defineStore} from 'pinia';
import type {
  GetPrinterListRequest,
  GetPrinterListResponse,
  GetPrinterDetailRequest,
  CreatePrinterInfoRequest,
  UpdatePrinterInfoRequest,
} from 'gap-nodejs-sdk';
import {sdk, gapMiniAppSdk} from '@/sdk';
import type {SetStorageItem, GetStorageItem, ScanNetworkPrinterInput} from 'gap-miniapp-sdk';

export const usePrinterStore = defineStore('printer', {
  state: () => ({
    printerList: [] as GetPrinterListResponse,
    // printerDetail: {} as GetPrinterDetailResponse,
    printerDetail: {ip_address: ''} as any,
    connectedPrinterType: 'network',
    isPrinterConnected: false,
    isPrintNoConnectShown: false,
    debounceTimer: 0,
    timer: null as any,
  }),
  actions: {
    async getPrinterList(data: GetPrinterListRequest): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        try {
          this.printerList = await sdk.printer.getPrinterList(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    async getPrinterDetail(data: GetPrinterDetailRequest): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        try {
          this.printerDetail = await sdk.printer.getPrinterDetail(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    async createPrinterInfo(data: CreatePrinterInfoRequest): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        try {
          await sdk.printer.createPrinterInfo(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    async updatePrinterInfo(data: UpdatePrinterInfoRequest): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        try {
          await sdk.printer.updatePrinterInfo(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    async checkPrinterConnectionAvailable() {
      if (this.connectedPrinterType != 'usb' && this.printerDetail?.ip_address) {
        const networkInput: ScanNetworkPrinterInput = {
          ip: this.printerDetail.ip_address,
          port: 9100,
        };
        try {
          const pingNetworkStatus: any = await gapMiniAppSdk.getInstance().pingNetworkDevice(networkInput);
          if (pingNetworkStatus?.data === true) {
            // activePrinterType.value = "network";
            // isDisconnected.value = false;
            this.isPrinterConnected = true;
          }
        } catch (error) {
          console.log('Error: ', error);
          // isDisconnected.value = true;
          this.isPrinterConnected = false;
        }
      } else if (this.connectedPrinterType == 'usb' && this.printerDetail?.productId) {
        // activePrinterType.value = "usb";
        // isDisconnected.value = false;
        this.isPrinterConnected = true;
      }
    },
    async getPrinterInfo() {
      let connectedPrinterType = localStorage.getItem('connectedPrinterType') || 'network';
      const connectedPrinterTypeStorage: GetStorageItem = {
        key: 'connectedPrinterType',
      };
      gapMiniAppSdk
        .getInstance()
        .getStorageItem(connectedPrinterTypeStorage)
        .then((res) => {
          const value = (res as any).value;
          if (value) {
            connectedPrinterType = value;
          }
        })
        .catch((e) => console.log(JSON.stringify(e)));

      connectedPrinterType = (connectedPrinterType as any).replaceAll('\\', '').replaceAll('|', '').replaceAll('"', '');
      this.setConnectedPrinterType(connectedPrinterType);

      let printerInfo = JSON.parse(localStorage.getItem('printerInfo') || '{}');
      if (!printerInfo || !printerInfo.ip_address) {
        printerInfo.ip_address = '';
      }

      const printerInfoStorage: GetStorageItem = {
        key: 'printerInfo',
      };

      gapMiniAppSdk
        .getInstance()
        .getStorageItem(printerInfoStorage)
        .then((res) => {
          const value = (res as any).value;
          if (value) {
            printerInfo = {...value};
          } else {
            printerInfo.ip_address = '';
          }
        })
        .catch((e) => console.log(JSON.stringify(e)));

      this.setPrinterDetail(printerInfo);

      await this.checkPrinterConnectionAvailable();
    },
    setPrinterDetail(data: any) {
      if (!data) {
        this.printerDetail = {ip_address: ''};
      } else {
        this.printerDetail = {...data};
      }

      localStorage.setItem('printerInfo', JSON.stringify(this.printerDetail));

      const printerInfo: SetStorageItem = {
        key: 'printerInfo',
        value: this.printerDetail,
      };

      gapMiniAppSdk
        .getInstance()
        .setStorageItem(printerInfo)
        .then(() => {})
        .catch((e) => {
          console.log('error set');
        });
    },
    setConnectedPrinterType(value: string) {
      this.connectedPrinterType = value;

      localStorage.setItem('connectedPrinterType', JSON.stringify(this.connectedPrinterType));

      const connectedPrinterType: SetStorageItem = {
        key: 'connectedPrinterType',
        value: this.connectedPrinterType,
      };

      gapMiniAppSdk
        .getInstance()
        .setStorageItem(connectedPrinterType)
        .then(() => {})
        .catch((e) => {
          console.log('error set');
        });
    },
    setPrinterConnected(value: boolean = false) {
      this.isPrinterConnected = value;
    },
    togglePrintNoConnectShown(value: boolean = false) {
      this.isPrintNoConnectShown = value;
    },
    setDebounceTimer() {
      this.debounceTimer = 5;

      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.debounceTimer--;
        if (this.debounceTimer == 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
  },
});

// export default {}
