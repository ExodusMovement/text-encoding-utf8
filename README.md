# Deprecated

Use [`@exodus/bytes/encoding-lite.js`](https://github.com/ExodusOSS/bytes#lite-version) for a lightweight `TextDecoder` polyfill:
```js
import { TextDecoder, TextEncoder } from '@exodus/bytes/encoding-lite.js'
```

or [`@exodus/bytes/encoding.js`](https://github.com/ExodusOSS/bytes#textencoder--textdecoder-polyfill) for a full polyfill with legacy multi-byte encodings support.
```js
import { TextDecoder, TextEncoder } from '@exodus/bytes/encoding.js'
```

## Warning

This old polyfill used `Buffer`, which on-Node.js is polyfilled with https://npmjs.com/buffer,
which has UTF-8 handling mistakes in both encoder and decoder.

Instead, use a strict implementation from `@exodus/bytes` (see links and examples above).
