const allowedTypes = ['string', 'object', 'boolean', 'number', 'undefined']

export default class SharedMap extends Map {
  constructor (socket) {
    super()
    this.socket = socket
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
