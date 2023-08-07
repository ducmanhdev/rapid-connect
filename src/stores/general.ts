import {ref} from 'vue';
import {defineStore} from 'pinia';
import {gapMiniAppSdk} from '@/sdk';
import {jsonToObject} from '@/utils/json';
import handleError from '@/utils/error';
import Pax from 'pax-ts';

type DeviceNetwork = {
  ip: string;
  port: number;
};
type Device = {
  name: string;
  serialNumber?: string;
  ip: string;
  port: number;
  isConnected: boolean;
};
export const useGeneralStore = defineStore('generalStore', () => {
  const isAsideVisible = ref(false);
  const showAside = () => (isAsideVisible.value = true);
  const hideAside = () => (isAsideVisible.value = false);
  const toggleAside = () => {
    isAsideVisible.value = !isAsideVisible.value;
  };

  const listDevice = ref<Device[]>([]);
  const pax = ref<Pax | null>();
  const paxSerialNumber = ref<any>(null);
  const isGapMiniAppSdkReady = () => {
    return typeof gapMiniAppSdk !== 'undefined' && typeof gapMiniAppSdk.getInstance().getBridge() !== 'undefined';
  };
  const pingNetworkDevice = (data: DeviceNetwork): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const pingNetworkStatus: any = await gapMiniAppSdk.getInstance().pingNetworkDevice(data);
        if (pingNetworkStatus) {
          return resolve();
        }
        reject(`Can't ping network`);
      } catch (error) {
        reject(error);
      }
    });
  };
  const paxConfig = ref<DeviceNetwork | null>(null);
  const isPaxConnected = ref(false);
  const setPaxConnect = (value: boolean) => {
    isPaxConnected.value = value;
    listDevice.value = listDevice.value.map((device: Device) => {
      if (device.name === 'PAX') {
        device.isConnected = value;
      }
      return device;
    });
  };
  const setPaxConfig = async (config: DeviceNetwork) => {
    paxConfig.value = {...config};
    if (isGapMiniAppSdkReady()) {
      await gapMiniAppSdk.getInstance().setStorageItem({
        key: 'paxConfig',
        value: paxConfig.value,
      });
    }
    localStorage.setItem('paxConfig', JSON.stringify(paxConfig.value));
  };
  const connectPax = (config: DeviceNetwork) => {
    return new Promise(async (resolve, reject) => {
      try {
        setPaxConnect(false);
        const foundIndex = listDevice.value.findIndex((device: Device) => device.name === 'PAX');
        const deviceInfo = {
          name: 'PAX',
          ip: config.ip,
          port: config.port,
          isConnected: false,
        };
        if (foundIndex >= 0) {
          listDevice.value[foundIndex] = deviceInfo;
        } else {
          listDevice.value.push(deviceInfo);
        }
        await pingNetworkDevice(config);
        await setPaxConfig(config);
        pax.value = new Pax({
          ...config,
          miniApp: gapMiniAppSdk.getInstance(),
        });
        const res = await pax.value?.doInitialize();
        paxSerialNumber.value = res?.paxInfoResponse?.SN;
        listDevice.value.map((item: any) => {
          if (item.name === 'PAX') {
            item.serialNumber = res?.paxInfoResponse?.SN;
          }
          return item;
        });
        setPaxConnect(true);
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  };

  const printerConfig = ref<DeviceNetwork | null>(null);
  const isPrintDeviceConnected = ref(false);
  const setPrinterConnect = (value: boolean) => {
    isPrintDeviceConnected.value = value;
    listDevice.value = listDevice.value.map((device: Device) => {
      if (device.name === 'PRINTER') {
        device.isConnected = value;
      }
      return device;
    });
  };
  const setPrinterConfig = async (config: DeviceNetwork) => {
    printerConfig.value = {...config};
    if (isGapMiniAppSdkReady()) {
      await gapMiniAppSdk.getInstance().setStorageItem({
        key: 'printerConfig',
        value: printerConfig.value,
      });
    }
    localStorage.setItem('printerConfig', JSON.stringify(printerConfig.value));
  };
  const connectPrinter = async (config: DeviceNetwork) => {
    try {
      setPrinterConnect(false);
      const foundIndex = listDevice.value.findIndex((device: Device) => device.name === 'PRINTER');
      const deviceInfo = {
        name: 'PRINTER',
        ip: config.ip,
        port: config.port,
        isConnected: false,
      };
      if (foundIndex >= 0) {
        listDevice.value[foundIndex] = deviceInfo;
      } else {
        listDevice.value.push(deviceInfo);
      }
      await pingNetworkDevice(config);
      await setPrinterConfig(config);
      setPrinterConnect(true);
    } catch (error) {
      handleError({error});
    }
  };

  const initPax = async () => {
    try {
      const paxConfigStorageItem: any = await gapMiniAppSdk.getInstance().getStorageItem({
        key: 'paxConfig',
      });
      const localStoragePaxConfig = jsonToObject(localStorage.getItem('paxConfig') || '{}');
      const config = {
        ip: paxConfigStorageItem?.value?.ip || localStoragePaxConfig?.ip || '',
        port: paxConfigStorageItem?.value?.port || localStoragePaxConfig?.port || '',
      };
      if (!config.ip || !config.port) return;
      await connectPax(paxConfigStorageItem.value);
    } catch (error) {
      handleError({error});
    }
  };
  const initPrinter = async () => {
    try {
      const printerConfigStorageIem: any = await gapMiniAppSdk.getInstance().getStorageItem({
        key: 'printerConfig',
      });
      const localStoragePrinterConfig = jsonToObject(localStorage.getItem('printerConfig') || '{}');
      const config = {
        ip: printerConfigStorageIem?.value?.ip || localStoragePrinterConfig?.ip || '',
        port: printerConfigStorageIem?.value?.port || localStoragePrinterConfig?.port || '',
      };
      if (!config.ip || !config.port) return;
      await connectPrinter(config);
    } catch (error) {
      handleError({error});
    }
  };
  const init = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!isGapMiniAppSdkReady()) {
          throw new Error(`GapMiniAppSdk is not ready!`);
        }
        await Promise.allSettled([initPax(), initPrinter()]);
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  };
  const toggleConnect = async (deviceConfig: Device) => {
    if (deviceConfig.name === 'PAX') {
      if (deviceConfig.isConnected) return setPaxConnect(false);
      await connectPax({
        ip: deviceConfig.ip,
        port: deviceConfig.port,
      });
    }
    if (deviceConfig.name === 'PRINTER') {
      if (deviceConfig.isConnected) return setPrinterConnect(false);
      await connectPrinter({
        ip: deviceConfig.ip,
        port: deviceConfig.port,
      });
    }
  };
  return {
    isGapMiniAppSdkReady,
    isAsideVisible,
    showAside,
    hideAside,
    toggleAside,
    pax,
    paxConfig,
    isPaxConnected,
    paxSerialNumber,
    connectPax,
    isPrintDeviceConnected,
    connectPrinter,
    listDevice,
    init,
    toggleConnect,
    printerConfig,
  };
});
