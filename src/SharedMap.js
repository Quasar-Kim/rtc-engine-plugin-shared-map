import Mitt from './Mitt.js'

const allowedTypes = ['string', 'object', 'boolean', 'number', 'undefined']

// Mitt에서 Map을 확장함
export default class SharedMap extends Mitt {
  constructor (socket) {
    super()
    this.socket = socket

    this.socket.on('set', payload => {
      const data = JSON.parse(payload)
      super.set(data.key, data.value)
      this.emit('remote-set', data)
    })
    this.socket.on('delete', key => {
      super.delete(key)
      this.emit('remote-delete')
    })
  }

  set (key, value) {
    if (!allowedTypes.includes(typeof key)) {
      throw new Error(`Invalid key: type '${typeof key}' is not allowed. Allowed types are ${allowedTypes.join(', ')}.`)
    }

    if (!allowedTypes.includes(typeof value)) {
      throw new Error(`Invalid value for key '${key}': type '${typeof value}' is not allowed. Allowed types are ${allowedTypes.join(', ')}.`)
    }

    if (this.get(key) === value) return

    const payload = JSON.stringify({ key, value })
    this.socket.writeEvent('set', payload)
    return super.set(key, value)
  }

  delete (key) {
    if (!this.has(key)) return

    this.socket.writeEvent('delete', key)
    return super.delete(key)
  }
}
