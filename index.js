const UTF8 = 'utf-8'

const normalizeEncoding = (encoding) => {
  const lower = encoding.toLowerCase()
  // https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
  if (lower === 'utf8' || lower === 'unicode-1-1-utf-8') return 'utf-8'
  return lower
}

const defineFinal = (obj, property, value) =>
  Object.defineProperty(obj, property, { value, writable: false })

const assertUTF8 = (encoding) => {
  if (encoding !== UTF8) {
    throw new Error('only utf-8 is supported')
  }
}

function TextEncoder(encoding = UTF8) {
  encoding = normalizeEncoding(encoding)
  assertUTF8(encoding)
  defineFinal(this, 'encoding', encoding)
}

TextEncoder.prototype.encode = function(str) {
  return Buffer.from(str)
}

TextEncoder.prototype.encodeInto = function() {
  throw new Error('not supported')
}

function TextDecoder(encoding = UTF8, options = {}) {
  encoding = normalizeEncoding(encoding)
  assertUTF8(encoding)

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

TextDecoder.prototype.decode = function(buf) {
  // not sure of if this is possible
  if (!Buffer.isBuffer(buf) && buf instanceof Uint8Array) {
    buf = Buffer.from(buf)
  }

  return buf.toString()
}

module.exports = {
  TextEncoder,
  TextDecoder,
}
