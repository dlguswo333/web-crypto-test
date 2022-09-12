const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

export function arrayBufferToString (buf: ArrayBuffer) {
  return decoder.decode(buf);
}

export function stringToArrayBuffer (str: string) {
  return encoder.encode(str);
}

export function stringToBase64 (str: string) {
  return btoa(encodeURI(str));
}

export function base64ToString (b64: string) {
  return decodeURI(atob(b64));
}

export function getStringLengthInBytes (str: string) {
  return stringToArrayBuffer(str).length;
}

export function formatMessage (prefix: string, postfix: string) {
  return function (log: string) {
    return `${prefix} ${log} ${postfix}\n`;
  };
}

export function useThrottle<T extends unknown[]> (func: (...args: T) => void, throttleMilliSecond: number) {
  let pending = false;
  return (...args: T) => {
    if (pending) {
      return;
    }
    pending = true;
    setTimeout(() => {
      func(...args);
      pending = false;
    }, throttleMilliSecond);
  };
}
