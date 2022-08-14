import { cipher, pki, random, util } from 'node-forge';

export function createRandomStringForge (length: number) {
  return random.getBytesSync(length);
}

export function aesEncryptForge (data: string, iv: string, key: string) {
  const cip = cipher.createCipher('AES-CBC', key);
  cip.start({ iv: iv });
  cip.update(util.createBuffer(util.encodeUtf8(data)));
  cip.finish();
  const result = cip.output;
  return result;
}

export function aesDecryptForge (data: util.ByteStringBuffer, iv: string, key: string) {
  const cip = cipher.createDecipher('AES-CBC', key);
  cip.start({ iv: iv });
  cip.update(data);
  cip.finish();
  const result = util.decodeUtf8(cip.output.bytes());
  return result;
}

export function createRsaKeyForge () {
  const keyPair = pki.rsa.generateKeyPair(2048, 0x010001);
  return keyPair;
}

/**
 * Unlike AES, RSA decryption emits an error if non-ASCII data are given (e.g. Korean characters).
 * Thus use utf-8 en/decoding before and after.
 */
export function rsaEncryptForge (data: string, key: pki.rsa.PublicKey) {
  const result = key.encrypt(util.encodeUtf8(data), 'RSA-OAEP');
  return result;
}

export function rsaDecryptForge (data: string, key: pki.rsa.PrivateKey) {
  const result = util.decodeUtf8(key.decrypt(data, 'RSA-OAEP'));
  return result;
}
