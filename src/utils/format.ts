import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
dayjs.extend(objectSupport);
import {DATE_FORMAT} from '@/constans';

export const currencyFormatter = (value: number | string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value));
};

export const numberParser = (value: string) => {
  return value.replace(/[^\d.]/g, '');
};

export const timestampToDate = (timestamp: string, _DATE_FORMAT = DATE_FORMAT) => {
  if (!timestamp) return '';
  const year = timestamp.substring(0, 4);
  const month = (timestamp.substring(4, 6) as unknown as number) - 1;
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(8, 10);
  const minute = timestamp.substring(10, 12);
  const second = timestamp.substring(12, 14);
  return dayjs({year, month, day, hour, minute, second}).format(_DATE_FORMAT);
};
