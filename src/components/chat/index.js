var State = require('dover')
var Observ = require('observ')
var extend = require('xtend')
var h = require('virtual-dom/h')
var sf = require('sheetify')
var AppendHook = require('append-hook')
var Scroll = require('../scroll')

var sheet = sf('./index.css')

module.exports = Chat

function Chat () {
  var state = State({
    conversation: Observ()
  })

  return state
}

Chat.render = function render (state, style) {
  if (!state.conversation) return

  return Scroll.render({
    className: sheet,
    style: extend(style, {left:0,top:0,bottom:0,right:0,position:'absolute'}),
    append: AppendHook(scrollBottom)
  }, [
    state.conversation.messages.map(function (message) {
      return h('message', {
        className: message.me ? 'me' : ''
      }, message.text)
    })
  ])
}

function scrollBottom (node) {
  setTimeout(function () {
    node.scrollTop = 9999
  })
}
