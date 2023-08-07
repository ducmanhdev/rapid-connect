import {fileURLToPath, URL} from 'node:url';

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
// @ts-ignore
import manifestConfig from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        maximumFileSizeToCacheInBytes: 20000000,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: manifestConfig,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'text-color': '#000',
          'primary-color': '#2D65EF',
          'error-color': '#EB5757',
          'font-size-base': '14px',
          'form-vertical-label-padding': '4px',
          'form-item-margin-bottom': '8px',
          'input-height-base': '38px',
          'input-padding-horizontal-base': '18px',
          'input-placeholder-color': '#AAAAAA',
          'border-color-base': '#D1D1D1',
          'border-radius-base': '4px',
          'btn-border-radius-base': '8px',
          'btn-height-base': '44px',
          'radio-size': '20px',
          'radio-dot-size': '14px',
          'menu-item-active-bg': '#FF0000',
          'checkbox-size': '20px',
        },
        javascriptEnabled: true,
      },
    },
  },
});
