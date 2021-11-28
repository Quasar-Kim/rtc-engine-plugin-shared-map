// https://generator.jspm.io/#a2VhYGBiDs0rySzJSU1hSExPL0pNTyzJzM9zMNQz0jPHFNFPLTYDAK42CbY2AA

const map = `
{
  "imports": {
    "extends-classes": "https://ga.jspm.io/npm:extends-classes@1.0.5/index.js"
  },
  "scopes": {
    "https://ga.jspm.io/npm:extends-classes@1.0.5/": {
      "method-missing": "https://ga.jspm.io/npm:method-missing@1.2.4/index.js"
    }
  }
}
`

const mapElem = document.createElement('script')
mapElem.setAttribute('type', 'importmap')
mapElem.innerHTML = map
document.body.append(mapElem)
