export const isValidJSON = (value: string): boolean => {
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

export const isArray = (array: any): boolean =>
  Object.prototype.toString.call(array) === '[object Array]';

export const shortenAddress = (
  address: string,
  expanded = false,
  amount = 6,
): string => {
  if (!address) {
    return '';
  }

  if (expanded) {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  }

  return `${address.slice(0, amount)}...`;
};
