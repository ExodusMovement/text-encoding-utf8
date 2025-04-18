const { TextEncoder, TextDecoder } = require('../')
const { TextEncoder: nodeTextEncoder, TextDecoder: nodeTextDecoder } = require('util')

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
      for (const encoding of ['utf-8', 'UTF8', 'Unicode-1-1-UTF-8']) {
        expect(new nodeTextDecoder(encoding).decode(arr)).toEqual(x)
        expect(new TextDecoder(encoding).decode(arr)).toEqual(x)
      }
    }
  })

  it('TextDecoder: utf-16le', () => {
    for (const x of ['one', '∀x']) {
      const arr = Buffer.from(x, 'utf-16le')
      for (const encoding of ['UTF-16', 'UTF-16le']) {
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
