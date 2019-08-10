const { TextEncoder, TextDecoder } = require('../')

describe('constructors', () => {
  it('defaults to utf-8', () => {
    expect(new TextEncoder().encoding).toEqual('utf-8')
    expect(new TextDecoder().encoding).toEqual('utf-8')
  })

  it('accepts utf-8', () => {
    expect(new TextEncoder('utf-8').encoding).toEqual('utf-8')
    expect(new TextEncoder('UTF-8').encoding).toEqual('utf-8')
    expect(new TextDecoder('utf-8').encoding).toEqual('utf-8')
    expect(new TextDecoder('UTF-8').encoding).toEqual('utf-8')
  })

  it('fails on non utf8', () => {
    expect(() => {}).toThrow()
    expect(() => new TextDecoder('base64')).toThrow()
  })
})
