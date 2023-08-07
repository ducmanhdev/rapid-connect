import {ref} from 'vue';
import {defineStore} from 'pinia';
import {sdk} from '@/sdk';

export const useBusinessStore = defineStore('businessStore', () => {
  const businessInfo = ref(null);
  const getBusinessInfo = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await sdk.business.getBusinessInfo();
        if (!response) {
          throw new Error(`Can't get business info!`);
        }
        businessInfo.value = response;
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };
  return {
    businessInfo,
    getBusinessInfo,
  };
});
