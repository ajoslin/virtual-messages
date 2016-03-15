var State = require('dover')
var Observ = require('observ')
var h = require('virtual-dom/h')
var sf = require('sheetify')

var sheet = sf('./index.css')

module.exports = Header

function Header (data) {
  data = data || {}

  return State({
    title: Observ(data.title || 'Messages')
  })
}

Header.render = function render (state) {
  return h('header', {className: sheet}, [
    h('h1.title', state.title)
  ])
}
