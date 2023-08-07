<template>
  <aside class="relative">
    <ul
      class="space-y-4 mb-0 bg-white text-black shadow-[0_0_6px_0_rgba(0,0,0,0.15)] py-3 px-2.5 h-full absolute top-0 left-0 bottom-0 md:static"
      :class="[isAsideVisible ? 'w-64' : '']"
    >
      <li v-for="menu in listMenu" :key="menu.title">
        <router-link
          :to="menu.link"
          class="group text-inherit flex items-center text-xl md:py-1.5 md:px-3 rounded-md"
          :class="[isAsideVisible ? 'py-1.5 px-3' : '']"
          active-class="bg-primary-lighter !text-primary font-semibold router-link-active"
        >
          <span
            class="w-[34px] h-[34px] rounded-md flex justify-center items-center shrink-0 bg-primary-lighter group-[.router-link-active]:bg-primary text-primary group-[.router-link-active]:bg-primary group-[.router-link-active]:text-white"
            v-html="menu.icon"
          ></span>
          <span class="ml-2 hidden md:block" :class="[isAsideVisible ? '!block' : '']">{{ menu.title }}</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useGeneralStore} from '@/stores/general';

const generalStore = useGeneralStore();
const isAsideVisible = computed(() => generalStore.isAsideVisible);
type Menu = {
  icon: string;
  title: string;
  link: {
    name: string;
  };
};
const listMenu: Menu[] = [
  {
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1_164)">
    <path d="M19.2857 2.13867H0.714286C0.319196 2.13867 0 2.45787 0 2.85296V17.1387C0 17.5338 0.319196 17.853 0.714286 17.853H19.2857C19.6808 17.853 20 17.5338 20 17.1387V2.85296C20 2.45787 19.6808 2.13867 19.2857 2.13867ZM1.60714 3.74581H18.3929V6.42439H1.60714V3.74581ZM18.3929 16.2458H1.60714V8.38867H18.3929V16.2458ZM13.1027 14.8172H16.7857C16.8839 14.8172 16.9643 14.7369 16.9643 14.6387V13.0315C16.9643 12.9333 16.8839 12.853 16.7857 12.853H13.1027C13.0045 12.853 12.9241 12.9333 12.9241 13.0315V14.6387C12.9241 14.7369 13.0045 14.8172 13.1027 14.8172Z" fill="currentColor"/>
    </g>
    <defs>
    <clipPath id="clip0_1_164">
    <rect width="20" height="20" fill="white"/>
    </clipPath>
    </defs>
    </svg>`,
    title: 'Credit',
    link: {
      name: 'credit',
    },
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.9285 1.78711H2.14279C1.94636 1.78711 1.78564 1.94782 1.78564 2.14425V8.92997C1.78564 9.1264 1.94636 9.28711 2.14279 9.28711H8.9285C9.12493 9.28711 9.28565 9.1264 9.28565 8.92997V2.14425C9.28565 1.94782 9.12493 1.78711 8.9285 1.78711ZM7.76779 7.76925H3.3035V3.30497H7.76779V7.76925ZM17.8571 1.78711H11.0714C10.8749 1.78711 10.7142 1.94782 10.7142 2.14425V8.92997C10.7142 9.1264 10.8749 9.28711 11.0714 9.28711H17.8571C18.0535 9.28711 18.2142 9.1264 18.2142 8.92997V2.14425C18.2142 1.94782 18.0535 1.78711 17.8571 1.78711ZM16.6964 7.76925H12.2321V3.30497H16.6964V7.76925ZM8.9285 10.7157H2.14279C1.94636 10.7157 1.78564 10.8764 1.78564 11.0728V17.8585C1.78564 18.055 1.94636 18.2157 2.14279 18.2157H8.9285C9.12493 18.2157 9.28565 18.055 9.28565 17.8585V11.0728C9.28565 10.8764 9.12493 10.7157 8.9285 10.7157ZM7.76779 16.6978H3.3035V12.2335H7.76779V16.6978ZM17.8571 10.7157H11.0714C10.8749 10.7157 10.7142 10.8764 10.7142 11.0728V17.8585C10.7142 18.055 10.8749 18.2157 11.0714 18.2157H17.8571C18.0535 18.2157 18.2142 18.055 18.2142 17.8585V11.0728C18.2142 10.8764 18.0535 10.7157 17.8571 10.7157ZM16.6964 16.6978H12.2321V12.2335H16.6964V16.6978Z" fill="currentColor"/>
    </svg>`,
    title: 'Settings',
    link: {
      name: 'settings',
    },
  },
];
</script>

<style scoped></style>
