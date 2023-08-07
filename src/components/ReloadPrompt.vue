<template>
  <Transition name="pwa-fade-in">
    <div v-if="needRefresh" class="pwa-toast-overlay"></div>
  </Transition>
  <Transition name="pwa-slide-down">
    <div v-if="needRefresh" class="pwa-toast-wrap">
      <div class="pwa-toast" role="alert">
        <div class="pwa-toast__icon">
          <img src="/src/assets/images/pwa-icon.svg" alt="" />
        </div>
        <div class="pwa-toast__title">New content available, <br />click on reload button to update!</div>
        <div class="pwa-toast__action">
          <button type="button" class="pwa-toast__action__btn" @click="handleReload">Reload</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/vue';

let interval: any;
const handleCheckUpdate = (swUrl: any, r: any, time: number = 5000) => {
  if (!r) return;
  clearInterval(interval);
  interval = setInterval(async () => {
    if (!(!r.installing && navigator)) return;
    if ('connection' in navigator && !navigator.onLine) return;
    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    });
    if (resp?.status === 200) await r.update();
  }, time);
};
const handleReload = async () => {
  await updateServiceWorker();
  window.location.reload();
};
const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW(swUrl: any, r: any) {
    console.log(`Service Worker at: ${swUrl}`);
    handleCheckUpdate(swUrl, r);
  },
  onRegisterError(error: any) {
    console.log(`Service Worker register error: ${error}`);
  },
});


</script>

<style lang="scss" scoped>
.pwa-fade-in-enter-active,
.pwa-fade-in-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.pwa-fade-in-enter-from,
.pwa-fade-in-leave-to {
  opacity: 0;
}

.pwa-slide-down-enter-active,
.pwa-slide-down-leave-active {
  transition: all 0.3s ease-in-out;
}

.pwa-slide-down-enter-from,
.pwa-slide-down-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

.pwa-toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 999998;
}
.pwa-toast-wrap {
  overflow: auto;
  padding: 16px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  z-index: 999999;
}
.pwa-toast {
  --primary: #5669ff;
  text-align: center;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  background-color: #fff;
  color: #333333;
  padding: 32px;
  width: calc(100% - 32px);
  max-width: 520px;
  margin: auto;
  &__icon {
    margin-bottom: 12px;

    img {
      display: block;
      width: 100%;
      max-width: 160px;
      height: auto;
      margin: 0 auto;
      //animation: rocket 2s forwards infinite;
    }
  }

  &__title {
    font-size: 26px;
    font-weight: 500;
    margin-bottom: 16px;
    line-height: 1.3;
    color: var(--primary);
  }

  &__action {
    display: flex;
    width: 100%;
    max-width: 160px;
    margin: 0 auto;
    &__btn {
      flex: 1 1 50%;
      appearance: none;
      outline: none;
      border: 1px solid var(--primary);
      margin-right: 16px;
      border-radius: 8px;
      padding: 8px 10px;
      background-color: var(--primary);
      color: #fff;
      font-size: 18px;
      transition: all 0.2s;
      font-weight: 500;
      &:hover {
        opacity: 0.85;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
