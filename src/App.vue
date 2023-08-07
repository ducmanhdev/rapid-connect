<template>
  <div class="h-screen grid place-items-center" v-if="isLoading">
    <base-loading></base-loading>
  </div>
  <template v-else-if="route.name !== 'login'">
    <div class="h-screen flex flex-col">
      <the-header class="shrink-0"></the-header>
      <main class="grow flex">
        <the-aside class="w-[54px] md:w-[170px]"></the-aside>
        <div class="py-4 px-5 w-[calc(100%-54px)] md:w-[calc(100%-170px)] flex flex-col">
          <the-breadcrumb class="shrink-0"></the-breadcrumb>
          <router-view></router-view>
        </div>
      </main>
    </div>
    <the-numpad></the-numpad>
  </template>
  <router-view v-else></router-view>
  <reload-prompt></reload-prompt>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, watch} from 'vue';
import TheHeader from '@/components/layouts/TheHeader.vue';
import TheAside from '@/components/layouts/TheAside.vue';
import TheNumpad from '@/components/layouts/TheNumpad.vue';
import TheBreadcrumb from '@/components/layouts/TheBreadcrumb.vue';
import {sdkInit} from '@/sdk';
import {useGeneralStore} from '@/stores/general';
import {useBusinessStore} from '@/stores/business';
import handleError from '@/utils/error';
import BaseLoading from '@/components/BaseLoading.vue';
import ReloadPrompt from '@/components/ReloadPrompt.vue';
import {useRoute} from 'vue-router';
import {useUserStore} from '@/stores/user';

const route = useRoute();
const userStore = useUserStore();
const generalStore = useGeneralStore();
const businessStore = useBusinessStore();

const isLoading = ref(true);
const handleInit = async () => {
  try {
    isLoading.value = true;
    await sdkInit();
    await userStore.getUserInfo();
    await businessStore.getBusinessInfo();
    await generalStore.init();
  } catch (error) {
    handleError({error});
  } finally {
    isLoading.value = false;
  }
};
handleInit();
watch(() => userStore.reloadSdkCount, handleInit);

const setViewportProperty = () => {
  let prevClientHeight: number;
  const customVar = '--vh';
  const doc = document.documentElement;

  function handleResize() {
    let clientHeight = doc.clientHeight;
    if (clientHeight === prevClientHeight) return;
    requestAnimationFrame(function updateViewportHeight() {
      doc.style.setProperty(customVar, clientHeight * 0.01 + 'px');
      prevClientHeight = clientHeight;
    });
  }

  handleResize();
  return handleResize;
};
onMounted(async () => {
  window.addEventListener('resize', setViewportProperty());
});
onUnmounted(() => {
  window.removeEventListener('resize', setViewportProperty());
});
</script>

<style scoped></style>
