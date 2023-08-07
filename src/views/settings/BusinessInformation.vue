<template>
  <section class="card grow p-0">
    <div class="divide-y child:py-5 child:px-[30px]">
      <div class="grid grid-cols-[1fr_30px] gap-2 py-3.5 px-5 justify-items-center">
        <router-link :to="{name: 'settings'}" type="button" class="flex items-center w-full text-inherit">
          <img src="@/assets/images/left-arrow.svg" alt="" class="shrink-0 mr-2.5" />
          Settings
        </router-link>
        <button type="button" @click="handleReload">
          <img src="@/assets/images/icon-refresh.svg" alt="" />
        </button>
      </div>
      <base-loading class="p-4" v-if="isGetBusinessInfoLoading"></base-loading>
      <div v-else class="divide-y divide-CE6">
        <div class="py-3 first:pt-0 last:pb-0">
          <p class="mb-0 text-base font-medium">Business name</p>
          <p class="mb-0 text-C82">{{ businessInfo?.name }}</p>
        </div>
        <div class="py-3 first:pt-0 last:pb-0">
          <p class="mb-0 text-base font-medium">Business phone</p>
          <p class="mb-0 text-C82">{{ businessInfo?.phone }}</p>
        </div>
        <div class="py-3 first:pt-0 last:pb-0">
          <p class="mb-0 text-base font-medium">Business address</p>
          <p class="mb-0 text-C82">{{ businessInfo?.address }}</p>
        </div>
        <div class="py-3 first:pt-0 last:pb-0">
          <p class="mb-0 text-base font-medium">Business phone</p>
          <p class="mb-0 text-C82">{{ businessInfo?.city }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useBusinessStore} from '@/stores/business';
import BaseLoading from '@/components/BaseLoading.vue';
import handleError from '@/utils/error';
const businessStore = useBusinessStore();
const businessInfo = computed<any>(() => businessStore.businessInfo);
const isGetBusinessInfoLoading = ref(false);

const handleGetBusinessInfo = async () => {
  try {
    isGetBusinessInfoLoading.value = true;
    await businessStore.getBusinessInfo();
  } catch (error) {
    handleError({error});
  } finally {
    isGetBusinessInfoLoading.value = false;
  }
};

const handleReload = () => {
  handleGetBusinessInfo();
};
</script>

<style scoped></style>
