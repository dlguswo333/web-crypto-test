import * as Forge from './forge';
import * as WebCrypto from './webCrypto';
import { arrayBufferToString, formatMessage, formatTime, getStringLengthInBytes, stringToArrayBuffer, useThrottle } from './util';
import { pki } from 'node-forge';

const aesContents = document.getElementById('aes-contents') as HTMLTextAreaElement;
const aesRepeat = document.getElementById('aes-repeat') as HTMLInputElement;
const aesCryptoButton = document.getElementById('aes-crypto-button') as HTMLButtonElement;
const aesCryptoOutput = document.getElementById('aes-crypto-output') as HTMLTextAreaElement;
const aesForgeButton = document.getElementById('aes-forge-button') as HTMLButtonElement;
const aesForgeOutput = document.getElementById('aes-forge-output') as HTMLTextAreaElement;
const rsaContents = document.getElementById('rsa-contents') as HTMLTextAreaElement;
const rsaRepeat = document.getElementById('rsa-repeat') as HTMLInputElement;
const rsaCryptoButton = document.getElementById('rsa-crypto-button') as HTMLButtonElement;
const rsaCryptoOutput = document.getElementById('rsa-crypto-output') as HTMLTextAreaElement;
const rsaForgeButton = document.getElementById('rsa-forge-button') as HTMLButtonElement;
const rsaForgeOutput = document.getElementById('rsa-forge-output') as HTMLTextAreaElement;

const getKeyGenerationBenchmarkMessage = formatMessage('key generation:');
const getEnDecrpytionBenchmarkMessage = formatMessage('En/Decryption:');

async function asyncBenchmark (func: () => Promise<void>, repeat = 1) {
  const start = performance.now();
  try {
    for (let i = 0;i < repeat;++i) {
      await func();
    }
  } catch (e) {
    const end = performance.now();
    alert(e?.message);
    return end - start;
  }
  const end = performance.now();
  return end - start;
}

function benchmark (func: () => void, repeat = 1) {
  const start = performance.now();
  try {
    for (let i = 0;i < repeat;++i) {
      func();
    }
  } catch (e) {
    const end = performance.now();
    alert(e?.message);
    return end - start;
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
    const key = await WebCrypto.createAesKey();
    const iv = WebCrypto.createRandomBytes(16);

    const interval = await asyncBenchmark(async () => {
      const encryptedData = await WebCrypto.aesEncrypt(
        stringToArrayBuffer(data),
        iv,
        key
      );
      const decryptedData = arrayBufferToString(await WebCrypto.aesDecrypt(
        encryptedData,
        iv,
        key
      ));
      if (data !== decryptedData) {
        throw new Error('AES Web Crypto logics not valid');
      }
    }, repeat);
    aesCryptoOutput.value += formatTime(interval) + '\n';
  });

  aesForgeButton.addEventListener('click', () => {
    const repeat = Number(aesRepeat?.value);
    if (!(repeat > 0)) {
      return;
    }
    const data = aesContents.value;
    const key = Forge.createRandomString(32);
    const iv = Forge.createRandomString(16);

    const interval = benchmark(() => {
      const encryptedData = Forge.aesEncrypt(
        data,
        iv,
        key
      );
      const decryptedData = Forge.aesDecrypt(
        encryptedData,
        iv,
        key
      );
      if (data !== decryptedData) {
        throw new Error('AES Forge logics not valid');
      }
    }, repeat);
    aesForgeOutput.value += formatTime(interval) + '\n';
  });

  rsaCryptoButton.addEventListener('click', async () => {
    const repeat = Number(rsaRepeat?.value);
    if (!(repeat > 0)) {
      return;
    }
    const data = rsaContents.value;
    let privateKey: CryptoKey, publicKey: CryptoKey;
    let interval = await asyncBenchmark(async () => {
      const keyPair = await WebCrypto.createRsaKey();
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    });
    rsaCryptoOutput.value += getKeyGenerationBenchmarkMessage(interval);

    interval = await asyncBenchmark(async () => {
      try {
        const encryptedData = await WebCrypto.rsaEncrypt(stringToArrayBuffer(data), publicKey);
        const decryptedData = arrayBufferToString(await WebCrypto.rsaDecrypt(encryptedData, privateKey));
        if (data !== decryptedData) {
          throw new Error('RSA Web Crypto logics not valid');
        }
      } catch (e) {
        throw new Error(e?.message || 'RSA Web Crypto failed. Possibly because the input message length is too long.');
      }
    }, repeat);
    rsaCryptoOutput.value += getEnDecrpytionBenchmarkMessage(interval);
  });

  rsaForgeButton.addEventListener('click', () => {
    const repeat = Number(rsaRepeat?.value);
    if (!(repeat > 0)) {
      return;
    }
    const data = rsaContents.value;
    let privateKey: pki.rsa.PrivateKey, publicKey: pki.rsa.PublicKey;
    let interval = benchmark(() => {
      const keyPair = Forge.createRsaKey();
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    });
    rsaForgeOutput.value += getKeyGenerationBenchmarkMessage(interval);

    interval = benchmark(() => {
      const encryptedData = Forge.rsaEncrypt(data, publicKey);
      const decryptedData = Forge.rsaDecrypt(encryptedData, privateKey);
      if (data !== decryptedData) {
        throw new Error('RSA Forge logics not valid');
      }
    }, repeat);
    rsaForgeOutput.value += getEnDecrpytionBenchmarkMessage(interval);
  });
}

function attachOnTypeListener () {
  const aesLengthSpan = document.getElementById('aes-contents-length') as HTMLSpanElement;
  const rsaLengthSpan = document.getElementById('rsa-contents-length') as HTMLSpanElement;

  aesContents.addEventListener('input', useThrottle(() => {
    const bytesLength = getStringLengthInBytes(aesContents.value);
    aesLengthSpan.innerText = bytesLength.toString() + 'B';
  }, 200));

  rsaContents.addEventListener('input', useThrottle(() => {
    const bytesLength = getStringLengthInBytes(rsaContents.value);
    rsaLengthSpan.innerText = bytesLength.toString() + 'B';
  }, 200));
}

attachRunner();
attachOnTypeListener();
