<template>
  <div class="login">
    <div class="login__inside">
      <div class="login__left">
        <div class="login__left__title">
          <p class="text-[20px] font-semibold m-0">Welcome to</p>
          <p class="text-[32px] font-bold m-0">Rapid connect</p>
          <p class="mb-0">Login your account</p>
        </div>
        <div class="login__left__form">
          <a-form
            ref="formRef"
            class="login-form"
            :model="formModel"
            :rules="formRules"
            @finish="handleLogin"
            layout="vertical"
          >
            <a-form-item label="ID" name="id">
              <a-input v-model:value="formModel.id"></a-input>
            </a-form-item>
            <a-form-item label="Username / Email" name="username">
              <a-input v-model:value="formModel.username"></a-input>
            </a-form-item>
            <a-form-item label="Password" name="password">
              <a-input-password v-model:value="formModel.password"></a-input-password>
            </a-form-item>
            <a-form-item class="custom_remember">
              <a-form-item name="remember" no-style>
                <a-checkbox v-model:checked="formModel.remember_me">Remember me</a-checkbox>
              </a-form-item>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit" class="login-form__button" :loading="isLoginLoading">
                Log in
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <div class="login__right">
        <img src="@/assets/images/login-right.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Rule} from 'ant-design-vue/es/form';
import {ref} from 'vue';
import type {FormInstance} from 'ant-design-vue';
import {useUserStore} from '@/stores/user';
import {useRouter} from 'vue-router';
import handleError from '@/utils/error';

const router = useRouter();
const userStore = useUserStore();
const {login, getDnsInfo} = userStore;

interface FormModel {
  id: string;
  username: string;
  password: string;
  remember_me: boolean;
}

const formRef = ref<FormInstance>();
const formModel = ref<FormModel>({
  id: '',
  username: '',
  password: '',
  remember_me: true,
});

const formRules: Record<string, Rule[]> = {
  id: [{required: true, message: 'ID is required'}],
  username: [{required: true, message: 'Username is required'}],
  password: [{required: true, message: 'Password is required'}],
};

const isLoginLoading = ref(false);
const handleLogin = async () => {
  try {
    isLoginLoading.value = true;
    const dnsInfoResponse = await getDnsInfo({
      id: formModel.value.id,
      type: 'new',
      remember_me: formModel.value.remember_me,
    });
    await login({
      username: formModel.value.username,
      password: formModel.value.password,
      g_client_id: formModel.value.id,
      domain: (dnsInfoResponse as any).domain,
      remember_me: formModel.value.remember_me,
    });
    await router.push('/');
  } catch (error: any) {
    console.error(error);
    handleError({
      error: error,
    });
  } finally {
    isLoginLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login {
  --breakpoint: 640px;
  background: url(@/assets/images/login-top-left.svg) left top no-repeat,
    url(@/assets/images/login-bottom-right.svg) right bottom no-repeat;
  background-size: 12%, 64%;
  min-height: 100vh;
  min-height: calc(100 * var(--vh));
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 640px) {
    display: block;
    background-size: 40%, 84%;
  }

  &__inside {
    display: grid;
    grid-template-columns: 4fr 6fr;
    justify-items: flex-end;
    padding: 5rem 2rem;
    width: 100%;
    max-width: 1688px;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      justify-items: initial;
    }
  }

  &__left {
    width: 306px;
    @media (max-width: 640px) {
      width: 100%;
    }

    &__title {
      margin-bottom: 2.5rem;
      @media (max-width: 640px) {
        text-align: center;
        margin-bottom: 1.25rem;
      }
    }

    &__form {
      .ant-input,
      .login__form__input {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 8px 12px;
        font-weight: 400;
      }

      :deep(.ant-input) {
        font-weight: 400;

        .ant-input-affix-wrapper {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
        }
      }

      :deep {
        .ant-form-item-label > label {
          font-size: 16px;
          font-weight: 600;
        }

        .ant-input-affix-wrapper {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 8px 12px;
        }
      }
    }

    :deep(.ant-form-item-children-icon) {
      top: 68%;
    }
  }

  &__right {
    img {
      display: block;
      width: 820px;
      max-width: 100%;
      margin-left: auto;
    }
  }
}

.login-form {
  &__button {
    margin-top: 1.5rem;
    @media (max-width: 640px) {
      margin-top: 0;
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.custom_remember {
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
