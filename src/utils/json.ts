export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const jsonToObject = (data: any) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return data;
  }
  return JSON.parse(data);
};
