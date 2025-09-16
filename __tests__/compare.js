const { TextEncoder, TextDecoder } = require('../')
const { TextEncoder: nodeTextEncoder, TextDecoder: nodeTextDecoder } = require('util')

const UTF8names = [
  'utf-8',
  'utf8',
  'unicode-1-1-utf-8',
  'unicode11utf8',
  'unicode20utf8',
  'x-unicode20utf8',
]
const UTF16LEnames = [
  'utf-16le',
  'utf-16',
  'ucs-2',
  'unicode',
  'unicodefeff',
  'iso-10646-ucs-2',
  'csunicode',
] // but not utf16

describe('compare with Node.js impl', () => {
  it('TextEncoder', () => {
    for (const x of ['one', '∀x']) {
      const node = new nodeTextEncoder().encode(x)
      expect(new TextEncoder().encode(x)).toEqual(node)
    }
  })

  it('TextDecoder: utf-8', () => {
    for (const x of ['one', '∀x']) {
      const arr = new nodeTextEncoder().encode(x)
      for (const encoding of UTF8names) {
        expect(new nodeTextDecoder(encoding).decode(arr)).toEqual(x)
        expect(new TextDecoder(encoding).decode(arr)).toEqual(x)
      }
    }
  })

  it('TextDecoder: utf-16le', () => {
    for (const x of ['one', '∀x']) {
      const arr = Buffer.from(x, 'utf-16le')
      for (const encoding of UTF16LEnames) {
        expect(new nodeTextDecoder(encoding).decode(arr)).toEqual(x)
        expect(new TextDecoder(encoding).decode(arr)).toEqual(x)
      }
    }
  })

  it('TextDecoder: accept ArrayBuffer', () => {
    for (const x of ['one', '∀x']) {
      const arr = new nodeTextEncoder().encode(x)
      const buf = arr.buffer
      expect(buf.byteLength).toBe(arr.length)
      expect(new nodeTextDecoder().decode(buf)).toEqual(x)
      expect(new TextDecoder().decode(buf)).toEqual(x)
    }
  })
})
