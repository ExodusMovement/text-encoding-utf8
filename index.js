const UTF8 = 'utf-8'
const UTF16LE = 'utf-16le'

const normalizeEncoding = (encoding) => {
  const lower = encoding.toLowerCase()
  // https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
  if (lower === 'utf8' || lower === 'unicode-1-1-utf-8') return UTF8
  if (lower === 'utf-16') return UTF16LE // but not utf16
  return lower
}

const defineFinal = (obj, property, value) =>
  Object.defineProperty(obj, property, { value, writable: false })

const assertUTF8 = (encoding) => {
  if (encoding !== UTF8) {
    throw new Error('only utf-8 is supported')
  }
}

const assertUTF8orUTF16LE = (encoding) => {
  // We don't include ascii because it's an alias to windows-1252 in TextDecoder and differs from Buffer ascii
  // We don't include utf-16be because it's not supported by buffer package
  if (encoding !== UTF8 && encoding !== UTF16LE) {
    throw new Error('only utf-8 and utf-16le are supported')
  }
}

const assertBufferSource = (buf) => {
  if (buf instanceof ArrayBuffer || ArrayBuffer.isView(buf)) return
  if (globalThis.SharedArrayBuffer && buf instanceof globalThis.SharedArrayBuffer) return
  throw new Error('argument must be a SharedArrayBuffer, ArrayBuffer or ArrayBufferView')
}

// encoding argument is non-standard but catches usage of 'text-encoding' npm package API
// Standard TextEncoder constructor doesn't have any arguments at all and is always utf-8
function TextEncoder(encoding = UTF8) {
  encoding = normalizeEncoding(encoding)
  assertUTF8(encoding)
  defineFinal(this, 'encoding', encoding)
}

TextEncoder.prototype.encode = function (str) {
  const buf = Buffer.from(str)
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.length)
}

TextEncoder.prototype.encodeInto = function () {
  throw new Error('not supported')
}

function TextDecoder(encoding = UTF8, options = {}) {
  encoding = normalizeEncoding(encoding)
  assertUTF8orUTF16LE(encoding)

  // Buffer.from will throw
  const { fatal = true, ignoreBOM = false, stream = false } = options

  if (fatal === false) {
    throw new Error('disabling "fatal" mode is not supported')
  }

  if (ignoreBOM) {
    throw new Error('option "ignoreBOM" is not supported')
  }

  if (stream) {
    throw new Error('option "stream" is not supported')
  }

  // see: https://github.com/inexorabletash/text-encoding/blob/master/lib/encoding.js#L1049
  defineFinal(this, 'encoding', encoding)
  defineFinal(this, 'fatal', fatal)
  defineFinal(this, 'ignoreBOM', ignoreBOM)
}

TextDecoder.prototype.decode = function (buf) {
  if (buf === undefined) return ''

  assertBufferSource(buf)

  if (!Buffer.isBuffer(buf)) {
    buf = Buffer.from(buf)
  }

  return buf.toString(this.encoding)
}

module.exports = {
  TextEncoder,
  TextDecoder,
}
