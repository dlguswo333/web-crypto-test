import { cipher, random, util } from 'node-forge';

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
