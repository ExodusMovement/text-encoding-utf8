const { TextEncoder, TextDecoder } = require('../')

describe('constructors', () => {
  it('defaults to utf8', () => {
    expect(new TextEncoder().encoding).toEqual('utf-8')
    expect(new TextDecoder().encoding).toEqual('utf-8')
  })

  it('fails on non utf8', () => {
    expect(() => new TextEncoder('base64')).toThrow(/utf\-8/)
    expect(() => new TextDecoder('base64')).toThrow(/utf\-8/)
  })
})
