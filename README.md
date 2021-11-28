# SharedMap plugin

연결된 피어끼리 공유된 Map을 구현하는 [RTCEngine](https://github.com/Quasar-Kim/rtc-engine) 플러그인.

```jsx
// 일반적인 맵과 동일하게 작동
const sharedMap = await engine.sharedMap('hello')
sharedMap.set('name', 'potato')
sharedMap.delete('name')

// 변경 사항 받기
// 종류로는 set / delete가 있음
sharedMap.on('remote-set', ({ key, val }) => console.log(`${key}가 ${val}로 변경됨`)
sharedMap.on('remote-delete', key => console.log(`${key}가 삭제됨`)
```

# 설치
`rtc-engine` 패키지가 설치되어 있어야 합니다.

```
npm install rtc-engine-plugin-shared-map
```


# 플러그인 사용하기

`RTCEngine.plugin()` 에 인자로 플러그인을 넘겨주고 난 뒤 엔진 인스턴스에서 `sharedMap()` async 메소드를 이용해 새로운 ShardMap 생성 가능. ShardMap을 만들때 넘겨주는 레이블은 식별자로 사용되므로 고유해야 함(channel, transaction과 동일)

```jsx
import sharedMapPlugin from 'rtc-engine-plugin-shared-map'
import RTCEngine from 'rtc-engine'
RTCEngine.plugin(sharedMapPlugin)

const engine = new RTCEngine(signaler)
const sharedMap = await engine.sharedMap('my-unique-label')
```

# API

이 클래스는 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#constructor), [Mitt](https://github.com/developit/mitt)를 확장합니다. 아래는 변경되거나 추가된 사항만 소개합니다. 설명되지 않은 API는 각각의 문서를 참고해주세요.

## 키 제한 조건

실제 Map과 다르게, 키와 그 값으로는 `JSON.stringify()` 를 이용해 시리얼라이징 할 수 있는 값만 사용 가능합니다. 사용가능하지 않은 키/값이 사용됬을 경우 에러가 발생합니다.

## SharedMap()

SharedMap 인스턴스를 생성하고, 데이터 공유에 사용되는 채널을 엽니다.