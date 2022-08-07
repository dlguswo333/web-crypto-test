import * as assert from 'assert';
import { arrayBufferToString, base64ToString, stringToArrayBuffer, stringToBase64 } from './index';

let str = 'helloWorld';
const encodeAndDecode = (str: string) => base64ToString(arrayBufferToString(stringToArrayBuffer(stringToBase64(str))));

assert.deepStrictEqual(encodeAndDecode(str), str);

str = '안녕 세상아';
assert.deepStrictEqual(encodeAndDecode(str), str);
