const { TextEncoder, TextDecoder } = require('../')
const { TextEncoder: NodeTextEncoder, TextDecoder: NodeTextDecoder } = require('util')

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
      const node = new NodeTextEncoder().encode(x)
      expect(new TextEncoder().encode(x)).toEqual(node)
    }
  })

  it('TextDecoder: utf-8', () => {
    for (const x of ['one', '∀x']) {
      const arr = new NodeTextEncoder().encode(x)
      for (const encoding of UTF8names) {
        expect(new NodeTextDecoder(encoding).decode(arr)).toEqual(x)
        expect(new TextDecoder(encoding).decode(arr)).toEqual(x)
      }
    }
  })

  it('TextDecoder: utf-16le', () => {
    for (const x of ['one', '∀x']) {
      const arr = Buffer.from(x, 'utf-16le')
      for (const encoding of UTF16LEnames) {
        expect(new NodeTextDecoder(encoding).decode(arr)).toEqual(x)
        expect(new TextDecoder(encoding).decode(arr)).toEqual(x)
      }
    }
  })

  it('TextDecoder: accept ArrayBuffer', () => {
    for (const x of ['one', '∀x']) {
      const arr = new NodeTextEncoder().encode(x)
      const buf = arr.buffer
      expect(buf.byteLength).toBe(arr.length)
      expect(new NodeTextDecoder().decode(buf)).toEqual(x)
      expect(new TextDecoder().decode(buf)).toEqual(x)
    }
  })

  it('TextDecoder: accept Uint32Array', () => {
    const buf = Uint32Array.of(0x2a_2a_2a_2a)
    const str = '****'
    expect(new NodeTextDecoder().decode(buf)).toEqual(str)
    expect(new TextDecoder().decode(buf)).toEqual(str)
  })
})
