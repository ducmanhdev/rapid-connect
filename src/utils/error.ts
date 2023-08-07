import {notification} from 'ant-design-vue';

interface HandleErrorParams {
  error: any;
  message?: string;
}

const handleError = ({error, message = 'Error'}: HandleErrorParams) => {
  const description =
    (error?.data?.errors && (Object as any).values(error.data.errors)) ||
    error?.messages ||
    error?.message ||
    'An unknown error';
  notification.error({
    message: message,
    description: description,
  });
};

export default handleError;
