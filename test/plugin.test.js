import sharedMapPlugin from '../src/index.js'
import SharedMap from '../src/SharedMap.js'

class RTCEngine {
  socket (label) {
    return { label, on () {} }
  }

  static plugin (plugin) {
    if (typeof plugin !== 'function') {
      throw new Error('only function-style plugin is supported')
    }

    plugin(RTCEngine)
  }
}

describe('plugin', () => {
  it('should construct sharedMap when RTCEngine.sharedMap is called', async () => {
    RTCEngine.plugin(sharedMapPlugin)
    const engine = new RTCEngine()

    const sharedMap = await engine.sharedMap('hello')
    expect(sharedMap instanceof SharedMap).to.equal(true)
    expect(sharedMap.socket.label).to.equal('hello')
  })
})
