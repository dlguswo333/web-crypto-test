import * as assert from 'assert';
import { arrayBufferToString, stringToArrayBuffer } from './util';

let str = 'helloWorld';
const encodeAndDecode = (str: string) => arrayBufferToString(stringToArrayBuffer((str)));

assert.deepStrictEqual(encodeAndDecode(str), str);

str = '안녕 세상아';
assert.deepStrictEqual(encodeAndDecode(str), str);
