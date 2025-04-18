const UTF8 = 'utf-8'
const UTF16LE = 'utf-16le'

// https://encoding.spec.whatwg.org/#names-and-labels
const UTF8alias = ['utf8', 'unicode-1-1-utf-8', 'unicode11utf8', 'unicode20utf8', 'x-unicode20utf8']
const UTF16LEalias = ['utf-16', 'ucs-2', 'unicode', 'unicodefeff', 'iso-10646-ucs-2', 'csunicode'] // but not utf16

const normalizeEncoding = (encoding) => {
  const lower = encoding.toLowerCase()
  if (UTF8 === lower || UTF16LE === lower) return lower // fast path
  if (UTF8alias.includes(lower)) return UTF8
  if (UTF16LEalias.includes(lower)) return UTF16LE
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

// encoding argument is non-standard but catches usage of 'text-encoding' npm package API
// Standard TextEncoder constructor doesn't have any arguments at all and is always utf-8
function TextEncoder(encoding = UTF8) {
  encoding = normalizeEncoding(encoding)
  assertUTF8(encoding)
  defineFinal(this, 'encoding', encoding)
}

TextEncoder.prototype.encode = function (str) {
  return Buffer.from(str)
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
  // not sure of if this is possible
  if (!Buffer.isBuffer(buf) && buf instanceof Uint8Array) {
    buf = Buffer.from(buf)
  }

  return buf.toString(this.encoding)
}

module.exports = {
  TextEncoder,
  TextDecoder,
}
