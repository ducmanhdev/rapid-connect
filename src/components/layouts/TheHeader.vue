<template>
  <header
    class="shrink-0 sticky top-0 left-0 bg-white text-black py-3 sm:py-4 px-5 sm:shadow-[1px_1px_2px_rgba(0,0,0,0.15)] z-[999] text-lg"
  >
    <div class="sm:h-full flex items-center justify-between">
      <div class="flex items-center text-secondary" @click="$router.push({name: 'home'})">
        <svg
          class="hidden sm:block mr-2.5"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.7489 11.3938L22.0364 9.68132L12.6061 0.251218C12.5266 0.171576 12.4321 0.108398 12.3281 0.0652921C12.2241 0.0221867 12.1126 0 12 0C11.8874 0 11.7759 0.0221867 11.6719 0.0652921C11.5679 0.108398 11.4734 0.171576 11.3939 0.251218L1.96599 9.68132L0.251074 11.395C0.0903139 11.5558 0 11.7738 0 12.0012C0 12.2285 0.0903139 12.4465 0.251074 12.6073C0.411833 12.768 0.62987 12.8584 0.857219 12.8584C1.08457 12.8584 1.3026 12.768 1.46336 12.6073L1.71348 12.3548V23.1432C1.71348 23.2557 1.73564 23.3671 1.77871 23.4711C1.82177 23.575 1.88488 23.6695 1.96445 23.749C2.04402 23.8286 2.13848 23.8917 2.24244 23.9348C2.3464 23.9778 2.45782 24 2.57034 24H21.4285C21.541 24 21.6524 23.9778 21.7564 23.9348C21.8603 23.8917 21.9548 23.8286 22.0344 23.749C22.1139 23.6695 22.177 23.575 22.2201 23.4711C22.2632 23.3671 22.2853 23.2557 22.2853 23.1432V12.3548L22.5366 12.6061C22.6974 12.7668 22.9154 12.8572 23.1428 12.8572C23.3701 12.8572 23.5882 12.7668 23.7489 12.6061C23.9097 12.4453 24 12.2273 24 12C24 11.7726 23.9097 11.5546 23.7489 11.3938ZM14.5712 22.2839H9.42523V15.4267H14.5712V22.2839ZM20.5716 22.2839H16.2861V14.5723C16.2861 14.345 16.1958 14.1271 16.0351 13.9664C15.8744 13.8057 15.6565 13.7154 15.4292 13.7154H8.57076C8.34351 13.7154 8.12556 13.8057 7.96487 13.9664C7.80418 14.1271 7.7139 14.345 7.7139 14.5723V22.2875H3.4284V10.6411L12.0006 2.06903L20.5728 10.6411L20.5716 22.2839Z"
            fill="currentColor"
          />
        </svg>
        <svg
          class="sm:hidden mr-2.5"
          height="18"
          id="Layer_1"
          style="enable-background: new 0 0 512 512"
          version="1.1"
          viewBox="0 0 512 512"
          width="18"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          v-if="generalStore.isAsideVisible"
          @click.stop="generalStore.hideAside"
        >
          <path
            d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
          />
        </svg>
        <svg
          class="sm:hidden mr-2.5"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          v-else
          @click.stop="generalStore.showAside"
        >
          <path d="M15.75 9H2.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.75 4.5H2.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.75 13.5H2.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="font-medium">Rapid Connect</span>
      </div>
      <div class="flex items-center">
        <input
          type="text"
          class="hidden sm:block mr-4 rounded-3xl border border-transparent text-A4 sm:w-[186px] h-[34px] text-sm appearance-none outline-none pl-[34px] pr-4 transition bg-[url('@/assets/images/icon-search.svg')] bg-no-repeat bg-[left_10px_center] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] focus:border-primary focus:shadow-none"
          placeholder="Search ..."
        />
        <div class="mr-6 sm:mr-3 flex items-center cursor-pointer">
          <a-badge :count="unreadNotificationCounter" show-zero color="var(--color-error)" class="cursor-pointer">
            <svg
              class="hidden sm:block"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6695 7.95849C16.6695 6.48557 16.0844 5.07298 15.0428 4.03147C14.0013 2.98996 12.5887 2.40485 11.1158 2.40485C9.64291 2.40485 8.23032 2.98996 7.18881 4.03147C6.1473 5.07298 5.56219 6.48557 5.56219 7.95849C5.56219 14.4377 2.78537 16.2889 2.78537 16.2889H19.4463C19.4463 16.2889 16.6695 14.4377 16.6695 7.95849Z"
                stroke="black"
                stroke-width="1.40805"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.7171 19.9914C12.5544 20.2719 12.3208 20.5048 12.0398 20.6666C11.7588 20.8285 11.4401 20.9137 11.1158 20.9137C10.7915 20.9137 10.4729 20.8285 10.1919 20.6666C9.91083 20.5048 9.67726 20.2719 9.51453 19.9914"
                stroke="black"
                stroke-width="1.40805"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              class="sm:hidden"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 6.55371C13.5 5.36024 13.0259 4.21564 12.182 3.37173C11.3381 2.52782 10.1935 2.05371 9 2.05371C7.80653 2.05371 6.66193 2.52782 5.81802 3.37173C4.97411 4.21564 4.5 5.36024 4.5 6.55371C4.5 11.8037 2.25 13.3037 2.25 13.3037H15.75C15.75 13.3037 13.5 11.8037 13.5 6.55371Z"
                stroke="black"
                stroke-width="1.40805"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.2981 16.3037C10.1663 16.531 9.97701 16.7197 9.74929 16.8509C9.52158 16.982 9.26341 17.0511 9.00062 17.0511C8.73784 17.0511 8.47967 16.982 8.25196 16.8509C8.02424 16.7197 7.83498 16.531 7.70312 16.3037"
                stroke="black"
                stroke-width="1.40805"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a-badge>
        </div>
        <div>
          <a-dropdown placement="bottomRight" :trigger="['click']" overlay-class-name="!min-w-0">
            <div class="flex items-center cursor-pointer font-medium">
              <span class="hidden sm:block mr-3">{{ businessInfo?.name }}</span>
              <a-avatar :size="28" :src="businessInfo?.logo_image || getImageUrl('default-avatar.svg')" />
            </div>
            <template #overlay>
              <a-menu style="min-width: 138px">
                <a-menu-item @click="handleLogout">Logout</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
    <input
      type="text"
      class="sm:hidden mt-3 rounded-3xl border border-transparent text-A4 w-full h-[34px] text-sm appearance-none outline-none pl-[34px] pr-4 transition bg-[url('@/assets/images/icon-search.svg')] bg-no-repeat bg-[left_10px_center] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] focus:border-primary focus:shadow-none"
      placeholder="Search ..."
    />
  </header>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {getImageUrl} from '@/utils/url';
import {useGeneralStore} from '@/stores/general';
import {useBusinessStore} from '@/stores/business';
// import {useUserStore} from '@/stores/user';
import {gapMiniAppSdk} from '@/sdk';

const generalStore = useGeneralStore();
const businessStore = useBusinessStore();
// const userStore = useUserStore();

const businessInfo = computed<any>(() => businessStore.businessInfo);
const unreadNotificationCounter = ref(0);
const handleLogout = () => {
  gapMiniAppSdk.getInstance().closeApp();
};
</script>

<style lang="scss" scoped>
:deep {
  .ant-badge-count {
    min-width: 1rem;
    height: 1rem;
    padding: 0;
    font-size: 0.575rem;
    top: 0.125rem;
    right: 0.25rem;
    line-height: 1rem;
  }
}
</style>
