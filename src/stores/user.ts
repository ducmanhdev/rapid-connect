import {defineStore} from 'pinia';
import {userSdk} from '@/sdk';
import Gap, {GapApiVersion} from 'gap-nodejs-sdk';
import type {GetDnsInfoRequest, GetUserInfoRequest, LoginRequest, LoginResponse} from 'gap-nodejs-sdk';

const baseApi = new Gap.BaseApi(GapApiVersion.V1);
export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    userInfo: null as any,
    reloadSdkCount: 0,
  }),
  getters: {
    isLoggedIn(): boolean {
      return Boolean(this.userInfo);
    },
  },
  actions: {
    login(data?: LoginRequest & {remember_me?: boolean}): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          const response: LoginResponse = await baseApi.auth.login(data);
          this.userInfo = response.user_info;
          this.accessToken = response.access_token;
          this.reloadSdkCount += 1;
          if (data?.remember_me) {
            localStorage.setItem('accessToken', response.access_token as any);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    async logout() {
      this.userInfo = null;
      this.accessToken = null;
      ['accessToken', 'id', 'domain'].forEach((key: string) => localStorage.removeItem(key));
      await (this as any).router.push({name: 'login'});
    },
    getUserInfo(data?: GetUserInfoRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.userInfo = await userSdk.auth.getUserInfo(data);
          resolve();
        } catch (error: any) {
          if (error?.response?.code === 401) {
            await this.logout();
          }
          reject(error);
        }
      });
    },
    getDnsInfo(data?: GetDnsInfoRequest & {remember_me?: boolean}): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await baseApi.auth.getDnsInfo(data);
          if (data?.remember_me) {
            localStorage.setItem('domain', response.domain);
            localStorage.setItem('id', response.client_id);
          }
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    },
  },
});
