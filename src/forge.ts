import { cipher, pki, random, util } from 'node-forge';

/**
 * NOTE AES and RSA in node-forge seem to emit an error if non-ASCII data are given directly (e.g. CJK characters).
 * Therefore use utf-8 en/decoding before encryption and after decryption.
 */

export function createRandomString (length: number) {
  return random.getBytesSync(length);
}

export function aesEncrypt (data: string, iv: string, key: string) {
  const cip = cipher.createCipher('AES-CBC', key);
  cip.start({ iv: iv });
  cip.update(util.createBuffer(util.encodeUtf8(data)));
  cip.finish();
  const result = cip.output;
  return result;
}

export function aesDecrypt (data: util.ByteStringBuffer, iv: string, key: string) {
  const cip = cipher.createDecipher('AES-CBC', key);
  cip.start({ iv: iv });
  cip.update(data);
  cip.finish();
  const result = util.decodeUtf8(cip.output.bytes());
  return result;
}

export function createRsaKey () {
  const keyPair = pki.rsa.generateKeyPair(2048, 0x010001);
  return keyPair;
}

export function rsaEncrypt (data: string, key: pki.rsa.PublicKey) {
  const result = key.encrypt(util.encodeUtf8(data), 'RSA-OAEP');
  return result;
}

export function rsaDecrypt (data: string, key: pki.rsa.PrivateKey) {
  const result = util.decodeUtf8(key.decrypt(data, 'RSA-OAEP'));
  return result;
}
