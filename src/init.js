var Delegator = require('dom-delegator')
var vdom = require('virtual-dom')
var mainLoop = require('main-loop')
var sf = require('sheetify')
var cuid = require('cuid')
var DataUri = require('create-data-uri')
var FastClick = require('fastclick')
var raf = require('raf')
var Tween = require('micro-tween')

var messages = require('./messages.json')
var App = require('./app')

module.exports = function init () {
  sf('reset.css', {global: true})
  sf('./global.css', {global: true})

  FastClick(document.body)
  Delegator()
  tick()

  var state = App({
    messages: messages
  })
  var loop = mainLoop(state(), App.render, vdom)

  document.body.appendChild(loop.target)

  state(loop.update)

  return state
}

document.addEventListener('deviceready', function () {
  window.StatusBar.styleDefault()
})

function tick () {
  Tween.update()
  raf(tick)
}

function iosScrollFix () {
  document.body.addEventListener('touchstart', function (event) {
    var scroll = getScrollable (event)
    if (!scroll) return

    if (scroll.scrollTop === 0) {
      scroll.scrollTop = 1
    } else if (scroll.scrollHeight === scroll.scrollTop + scroll.offsetHeight) {
      scroll.scrollTop -= 1;
    }
  })
}
