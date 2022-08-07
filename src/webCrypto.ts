export async function createAesKey () {
  return crypto.subtle.generateKey({
    name: 'AES-CBC',
    length: 256,
  }, true, ['encrypt', 'decrypt']);
}

export async function aseEncrypt (data: ArrayBuffer, iv: ArrayBuffer, key: CryptoKey) {
  const result = await crypto.subtle.encrypt({
    name: 'AES-CBC',
    iv: iv,
  }, key, data);
  return result;
}

export async function aesDecrypt (data: ArrayBuffer, iv: ArrayBuffer, key: CryptoKey) {
  const result = await crypto.subtle.decrypt({
    name: 'AES-CBC',
    iv: iv,
  }, key, data);
  return result;
}