import SharedMap from '../src/SharedMap.js'

describe('SharedMap', () => {
  beforeEach(function () {
    this.listeners = {}
    this.socket = {
      writeEvent: sinon.fake(),
      on: (eventName, callback) => {
        this.listeners[eventName] = callback
      }
    }
    this.map = new SharedMap(this.socket)
  })

  it('should emit set message when entry value is altered', function () {
    const payload = { name: 'red', rgb: '#ff0000' }
    this.map.set('color', payload)

    expect(this.socket.writeEvent.firstArg).to.equal('set')
    expect(JSON.parse(this.socket.writeEvent.lastArg)).to.deep.equal({
      key: 'color',
      value: payload
    })
    expect(this.map.get('color')).to.deep.equal(payload)
  })
  it('should emit delete message when the entry is deleted', function () {
    this.map.set('color', 'blue')
    this.map.delete('color')

    expect(this.socket.writeEvent.firstArg).to.equal('delete')
    expect(this.socket.writeEvent.lastArg).to.equal('color')
    expect(this.map.has('color')).to.equal(false)
  })

  it('should not emit set event if entry is not changed', function () {
    this.map.set('color', 'blue')
    this.map.set('color', 'blue')

    expect(this.socket.writeEvent.callCount).to.equal(1)
  })
  it('should not emit delete event if entry does not exists', function () {
    this.map.delete('color')

    expect(this.socket.writeEvent.callCount).to.equal(0)
  })
  it('should throw error if type of key is not allowed one', function () {
    expect(() => this.map.set(() => { }, 'hello')).to.throw()
  })
  it('should throw error if type of value is not allowed one', function () {
    expect(() => this.map.set('hello', () => { })).to.throw()
  })
  it('should set map value and emit remote-set event on receiving set event', function (done) {
    const payload = { key: 'hello', value: 'world' }
    this.map.on('remote-set', evt => {
      expect(payload).to.deep.equal(evt)
      done()
    })

    const callback = this.listeners.set
    callback(JSON.stringify(payload))

    expect(this.map.get('hello')).to.equal('world')
  })
  it('should emit remote-delete event on receiving delete event', function (done) {
    this.map.set('hello', 'world')
    this.map.on('remote-delete', evt => {
      expect(this.map.has('hello')).to.equal(false)
      done()
    })

    const callback = this.listeners.delete
    callback('hello')
  })
})
