const { TextEncoder, TextDecoder } = require('../')

describe('constructors', () => {
  it('defaults encoding to utf-8', () => {
    expect(new TextEncoder().encoding).toEqual('utf-8')
  })

  it('defaults decoding to utf-8', () => {
    expect(new TextDecoder().encoding).toEqual('utf-8')
  })

  it('encoder ctor accepts utf-8, disregards case', () => {
    expect(new TextEncoder('utf-8').encoding).toEqual('utf-8')
    expect(new TextEncoder('UTF-8').encoding).toEqual('utf-8')
    expect(new TextEncoder('UTF8').encoding).toEqual('utf-8')
  })

  it('decoder ctor accepts utf-8, disregards case', () => {
    expect(new TextDecoder('utf-8').encoding).toEqual('utf-8')
    expect(new TextDecoder('UTF-8').encoding).toEqual('utf-8')
    expect(new TextDecoder('UTF8').encoding).toEqual('utf-8')
  })

  it('rejects non utf-8 encoder', () => {
    expect(() => new TextEncoder('windows-1251')).toThrow('utf-8')
  })

  it('rejects utf-16 encoder', () => {
    expect(() => new TextEncoder('utf-16')).toThrow('utf-8')
  })

  it('rejects non utf-8 decoder', () => {
    expect(() => new TextDecoder('windows-1251')).toThrow('utf-8')
  })

  it('decoder ctor accepts utf-16le, disregards case', () => {
    expect(new TextDecoder('utf-16').encoding).toEqual('utf-16le')
    expect(new TextDecoder('UTF-16').encoding).toEqual('utf-16le')
    expect(new TextDecoder('UTF-16le').encoding).toEqual('utf-16le')
  })

  it('rejects disabling of "fatal" mode', () => {
    expect(() => new TextDecoder('utf-8', { fatal: false })).toThrow('not supported')
  })

  it('rejects "ignoreBOM" flag', () => {
    expect(() => new TextDecoder('utf-8', { ignoreBOM: true })).toThrow('not supported')
  })

  it('rejects "stream" flag', () => {
    expect(() => new TextDecoder('utf-8', { stream: true })).toThrow('not supported')
  })
})
