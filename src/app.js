var State = require('dover')
var h = require('virtual-dom/h')
var Observ = require('observ')
var sf = require('sheetify')

var Navbar = require('./components/navbar')
var Messages = require('./components/messages')
var Chat = require('./components/chat')

var sheet = sf('./app.css')

module.exports = App

function App (data) {
  data = data || {}

  var state = State({
    navbar: Navbar({stack: [{title: 'Messages'}]}),
    messages: Messages({list: data.messages}),
    chat: Chat(),
    mode: Observ('messages')
  })

  // Because we don't have a stack-based mobile router, we'll fake it for now.
  Messages.onMessage(state.messages, function (conversation) {
    state.mode.set('conversation')
    state.chat.conversation.set(conversation)
    Navbar.push(state.navbar, {
      title: conversation.with.firstName
    })
  })
  Navbar.onBack(state.navbar, function () {
    Navbar.pop(state.navbar)
    state.mode.set('messages')
  })

  return state
}

App.render = function render (state) {
  return h('app', {className: sheet}, [
    h('div.app-container', [
      Navbar.render(state.navbar),
      state.mode === 'messages'
        ? Messages.render(state.messages)
        : Chat.render(state.chat)
    ])
  ])
}
