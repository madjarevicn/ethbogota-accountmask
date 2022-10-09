export const isValidJSON = (value: string) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
};

export const wait = (time = 500, val = true) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, time);
  });

export const isArray = (array: any) =>
  Object.prototype.toString.call(array) === '[object Array]';
