import { aesDecrypt, aseEncrypt as aesEncrypt, createAesKey } from './webCrypto';

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

function attachRunner () {
  aesCryptoButton.addEventListener('click', async () => {
    const repeat = Number(aesRepeat?.value);
    if (!(repeat > 0)) {
      return;
    }
    const data = aesContents.value;
    const key = await createAesKey();
    const iv = createRandomBytes(16);

    const start = performance.now();
    for (let i = 0;i < repeat;++i) {
      const encryptedData = await aesEncrypt(
        stringToArrayBuffer(stringToBase64(data)),
        iv,
        key
      );
      const decryptedData = base64ToString(arrayBufferToString(await aesDecrypt(
        encryptedData,
        iv,
        key
      )));
      if (data !== decryptedData) {
        throw new Error('AES logics not valid');
      }
    }
    const end = performance.now();
    aesCryptoOutput.value += (end - start).toString() + ' ms\n';
  });
}

attachRunner();
