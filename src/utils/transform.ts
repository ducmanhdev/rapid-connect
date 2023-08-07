import dayjs from 'dayjs';

export const reverseObject = (obj: {[key: string]: any}) => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
};
export const dateToUUID = () => {
  const listNum = Array.from(new Array(9)).map((num, index) => (index + 1).toString());
  const listAlphabet = new Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i));
  const listAlphabetLowercase = [...listAlphabet].map((char: string) => char.toLowerCase());
  const listFinal = [...listNum, ...listAlphabetLowercase, ...listAlphabet];
  const currentDate = dayjs();
  const years = listFinal[+currentDate.format('YY')];
  const months = listFinal[+currentDate.format('MM')];
  const dates = listFinal[+currentDate.format('DD')];
  const hours = listFinal[+currentDate.format('HH')];
  const minutes = listFinal[+currentDate.format('mm')];
  const seconds = listFinal[+currentDate.format('ss')];
  return years + months + dates + hours + minutes + seconds;
};
