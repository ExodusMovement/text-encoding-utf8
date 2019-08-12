const UTF8 = 'utf-8'

const defineFinal = (obj, property, value) =>
  Object.defineProperty(obj, property, { value, writable: false })

const assertUTF8 = (encoding) => {
  if (encoding.toLowerCase() !== UTF8) {
    throw new Error('only utf-8 is supported')
  }
}

function TextEncoder(encoding = UTF8) {
  assertUTF8(encoding)
  defineFinal(this, 'encoding', encoding.toLowerCase())
}

TextEncoder.prototype.encode = function(str) {
  return Buffer.from(str)
}

TextEncoder.prototype.encodeInto = function() {
  throw new Error('not supported')
}

function TextDecoder(encoding = UTF8, options = {}) {
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
  defineFinal(this, 'encoding', encoding.toLowerCase())
  defineFinal(this, 'fatal', fatal)
  defineFinal(this, 'ignoreBOM', ignoreBOM)
}

TextDecoder.prototype.decode = function(buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)

  return buf.toString()
}

module.exports = {
  TextEncoder,
  TextDecoder,
}
