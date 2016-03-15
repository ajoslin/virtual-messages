var State = require('dover')
var Observ = require('observ')
var h = require('virtual-dom/h')
var sf = require('sheetify')
var Scroll = require('../scroll')

var sheet = sf('./index.css')

module.exports = Chat

function Chat () {
  return State({
    conversation: Observ()
  })
}

Chat.render = function render (state) {
  return Scroll.render({className: sheet}, [
    state.conversation.messages.map(function (message) {
      return h('div', [
        message.me ? ('me: ') : (state.conversation.with.firstName + ': '),
        message.text
      ])
    })
  ])
}
