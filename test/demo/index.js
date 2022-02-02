import FirebaseSignaler from 'rtc-engine-signaler-firebase'
import RTCEngine, { wait } from 'rtc-engine'
import sharedMapPlugin from '../../src/index.js'

RTCEngine.plugin(sharedMapPlugin)

async function main () {
  const signaler = new FirebaseSignaler({
    apiKey: 'AIzaSyDy-G0LbfR_EoF3gE1iDlmUwzWR9sJgHpI',
    authDomain: 'rtc-engine-demo.firebaseapp.com',
    projectId: 'rtc-engine-demo',
    storageBucket: 'rtc-engine-demo.appspot.com',
    messagingSenderId: '585690637567',
    appId: '1:585690637567:web:8107d33a313cc18efcd8ca'
  })
  const engine = new RTCEngine(signaler, { autoConnect: false })

  document.querySelector('#createRoom').addEventListener('click', async () => {
    const roomId = await signaler.createConnection()
    console.log('room created', roomId)
    engine.connect()
  })

  document.querySelector('#connect').addEventListener('click', async () => {
    const roomId = document.querySelector('#roomId').value
    await signaler.connect(roomId)
    engine.connect()
  })

  await wait(engine.connection).toBe('connected')
  const sharedMap = await engine.sharedMap('message')
  alert('connected!')

  const entriesElem = document.querySelector('#entries')
  function update () {
    entriesElem.innerHTML = ''
    for (const [key, val] of sharedMap.entries()) {
      const entry = document.createElement('li')
      entry.textContent = key + ':' + val
      const deleteBtnElem = document.createElement('button')
      entry.append(deleteBtnElem)
      deleteBtnElem.addEventListener('click', () => {
        sharedMap.delete(key)
        update()
      })
      deleteBtnElem.textContent = 'delete'
      entriesElem.append(entry)
    }
  }

  document.querySelector('#add').addEventListener('click', () => {
    const key = document.querySelector('#entryKey').value
    const val = document.querySelector('#entryVal').value
    sharedMap.set(key, val)
    update()
  })

  sharedMap.on('remote-set', update)
  sharedMap.on('remote-delete', update)
}

main()
