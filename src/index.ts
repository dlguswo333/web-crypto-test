import { aesDecryptForge, aesEncryptForge, createRandomStringForge } from './forge';
import { aesEncryptCrypto, createAesKeyCrypto, aesDecryptCrypto } from './webCrypto';

export function arrayBufferToString (buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export function stringToArrayBuffer (str: string) {
  const array = new Uint8Array(str.length);
  for (let i = 0;i < str.length;++i) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
}

export function stringToBase64 (str: string) {
  return btoa(encodeURI(str));
}

export function base64ToString (b64: string) {
  return decodeURI(atob(b64));
}
export function createRandomBytes (length: number) {
  const bytes = new Uint8Array(length);
  return crypto.getRandomValues(bytes);
}


const aesContents = document.getElementById('aes-contents') as HTMLTextAreaElement;
const aesRepeat = document.getElementById('aes-repeat') as HTMLInputElement;
const aesCryptoButton = document.getElementById('aes-crypto-button') as HTMLButtonElement;
const aesCryptoOutput = document.getElementById('aes-crypto-output') as HTMLTextAreaElement;
const aesForgeButton = document.getElementById('aes-forge-button') as HTMLButtonElement;
const aesForgeOutput = document.getElementById('aes-forge-output') as HTMLTextAreaElement;

async function asyncBenchmark (func: () => Promise<void>, repeat: number) {
  const start = performance.now();
  for (let i = 0;i < repeat;++i) {
    await func();
  }
  const end = performance.now();
  return end - start;
}

function benchmark (func: () => void, repeat: number) {
  const start = performance.now();
  for (let i = 0;i < repeat;++i) {
    func();
  }
  const end = performance.now();
  return end - start;
}

function attachRunner () {
  aesCryptoButton.addEventListener('click', async () => {
    const repeat = Number(aesRepeat?.value);
    if (!(repeat > 0)) {
      return;
    }
    const data = aesContents.value;
    const key = await createAesKeyCrypto();
    const iv = createRandomBytes(16);

    const interval = await asyncBenchmark(async () => {
      const encryptedData = await aesEncryptCrypto(
        stringToArrayBuffer(stringToBase64(data)),
        iv,
        key
      );
      const decryptedData = base64ToString(arrayBufferToString(await aesDecryptCrypto(
        encryptedData,
        iv,
        key
      )));
      if (data !== decryptedData) {
        throw new Error('AES logics not valid');
      }
    }, repeat);
    aesCryptoOutput.value += interval.toString() + ' ms\n';
  });

  aesForgeButton.addEventListener('click', () => {
    const repeat = Number(aesRepeat?.value);
    if (!(repeat > 0)) {
      return;
    }
    const data = aesContents.value;
    const key = createRandomStringForge(32);
    const iv = createRandomStringForge(16);

    const interval = benchmark(() => {
      const encryptedData = aesEncryptForge(
        data,
        iv,
        key
      );
      const decryptedData = aesDecryptForge(
        encryptedData,
        iv,
        key
      );
      if (data !== decryptedData) {
        throw new Error('AES logics not valid');
      }
    }, repeat);
    aesForgeOutput.value += interval.toString() + ' ms\n';
  });
}

attachRunner();
