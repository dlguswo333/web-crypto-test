export async function createAesKeyCrypto () {
  return crypto.subtle.generateKey({
    name: 'AES-CBC',
    length: 256,
  }, true, ['encrypt', 'decrypt']);
}

export async function aesEncryptCrypto (data: ArrayBuffer, iv: ArrayBuffer, key: CryptoKey): Promise<ArrayBuffer> {
  const result = await crypto.subtle.encrypt({
    name: 'AES-CBC',
    iv: iv,
  }, key, data);
  return result;
}

export async function aesDecryptCrypto (data: ArrayBuffer, iv: ArrayBuffer, key: CryptoKey): Promise<ArrayBuffer> {
  const result = await crypto.subtle.decrypt({
    name: 'AES-CBC',
    iv: iv,
  }, key, data);
  return result;
}

export async function createRsaKeyCrypto () {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      // NOTE node-forge seems to use SHA-1 hash when generating key pair,
      // but it is not known how to control the hash function in node-forge.
      // For consistency, use SHA-1 in Web Crypto API as well.
      hash: 'SHA-1'
    },
    false,
    ['encrypt', 'decrypt']
  );
  return keyPair;
}

export async function rsaEncryptCrypto (data: ArrayBuffer, key: CryptoKey) {
  const result = await crypto.subtle.encrypt({
    name: 'RSA-OAEP',
  }, key, data);
  return result;
}

export async function rsaDecryptCrypto (data: ArrayBuffer, key: CryptoKey) {
  const result = await crypto.subtle.decrypt({
    name: 'RSA-OAEP',
  }, key, data);
  return result;
}

export function createRandomBytesCrypto (length: number) {
  const bytes = new Uint8Array(length);
  return crypto.getRandomValues(bytes);
}
