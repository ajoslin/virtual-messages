var State = require('dover')
var Observ = require('observ')
var sf = require('sheetify')
var h = require('virtual-dom/h')
var last = require('array-last')
var clickEvent = require('value-event/click')
var Event = require('weakmap-event')
var Scroll = require('../scroll')

var sheet = sf('./index.css')

module.exports = Messages

function Messages (data) {
  data = data || {}

  return State({
    list: Observ(data.list || require('../../messages.json')),
    channels: {
      click: click
    }
  })
}

var MessageEvent = Event()
Messages.onMessage = MessageEvent.listen

function click (state, conversation) {
  MessageEvent.broadcast(state, conversation)
}

Messages.render = function render (state, style) {
  return Scroll.render({className: sheet, style: style}, state.list.map(renderMessage))

  function renderMessage (conversation) {
    var message = last(conversation.messages)

    return h('conversation', {
      'ev-click': clickEvent(state.channels.click, conversation)
    }, [
      h('img', {src: conversation.with.photo}),
      h('container', [
        h('top', [
          h('name', conversation.with.firstName + ' ' + conversation.with.lastName),
          h('right', [
            h('time', '12:42'),
            h('arrow')
          ])
        ]),
        h('summary', message ? message.text : 'Summary here!')
      ])
    ])
  }
}
