import Gap, {GapApiVersion} from 'gap-nodejs-sdk';
import {GapMiniAppSdk, Platform, type PrintInput} from 'gap-miniapp-sdk';
import type {AccessTokenData} from 'gap-miniapp-sdk';
import {useGeneralStore} from '@/stores/general';
import {useUserStore} from '@/stores/user';
export let sdk: any;
export let userSdk: any;

export const gapMiniAppSdk = (function () {
  let instance: GapMiniAppSdk;
  let domain = '';
  let gClient = '';
  let token = '';

  const createInstance = () => new GapMiniAppSdk();
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
    getConfig: async function () {
      try {
        let userAgent: Platform;
        if (window.navigator.userAgent.includes('Android')) {
          userAgent = Platform.ANDROID;
        } else if (window.navigator.userAgent.includes('iOS') || window.navigator.userAgent.includes('Macintosh')) {
          userAgent = Platform.IOS;
        } else if (window.navigator.userAgent.includes('EdgGapWindow')) {
          userAgent = Platform.WINDOW;
        } else if (window.navigator.userAgent.includes('Web')) {
          userAgent = Platform.WEB;
        }
        gapMiniAppSdk.getInstance().setPlatformExecutor(userAgent!);
        const response = await gapMiniAppSdk.getInstance().getAccessToken();
        if (
          response &&
          typeof (response as AccessTokenData).token !== 'undefined' &&
          (response as AccessTokenData).token != ''
        ) {
          domain = (response as AccessTokenData).domain;
          gClient = (response as AccessTokenData).gClientId;
          token = (response as AccessTokenData).token;
        }
      } catch (error) {
        console.error(error);
      }
      return {domain, gClient, token};
    },
  };
})();
export const sdkInit = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        domain = localStorage.getItem('domain'),
        gClient = localStorage.getItem('id'),
        token = localStorage.getItem('accessToken'),
    } = await gapMiniAppSdk.getConfig();
      if (!domain || !gClient || !token) {
        throw new Error(`SDK init failed: can't get access token`);
      }

      localStorage.setItem('domain', domain);
      localStorage.setItem('id', gClient);
      localStorage.setItem('accessToken', token);

      const userStore = useUserStore();
      userStore.accessToken = token;

      sdk = new Gap.PosClientApi(domain, gClient, token, GapApiVersion.V1);
      userSdk = new Gap.UserApi(domain, gClient, token, GapApiVersion.V1);
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
export const print = async (data: any): Promise<void> => {
  const generalStore = useGeneralStore();
  return new Promise(async (resolve, reject): Promise<void> => {
    try {
      const input: PrintInput = {
        ip: generalStore.printerConfig?.ip!,
        port: generalStore.printerConfig?.port!,
        data: data.toString(),
      };
      if (gapMiniAppSdk.getInstance() && gapMiniAppSdk.getInstance().getBridge()) {
        await gapMiniAppSdk.getInstance().printEscPos(input);
      }
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
