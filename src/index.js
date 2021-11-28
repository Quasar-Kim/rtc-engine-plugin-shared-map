import SharedMap from './SharedMap.js'

export default function sharedMapPlugin (RTCEngine) {
  RTCEngine.prototype.sharedMap = async function (label) {
    const socket = await this.socket(label)
    const sharedMap = new SharedMap(socket)
    return sharedMap
  }
}
