import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import { TextDecoder, TextEncoder } from 'text-encoding';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

if (typeof global.process === 'undefined') {
  global.process = require('process');
}

if (typeof global.crypto === 'undefined') {
  global.crypto = new Crypto();
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
