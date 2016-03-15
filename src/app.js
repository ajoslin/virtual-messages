var State = require('dover')
var h = require('virtual-dom/h')
var Observ = require('observ')
var sf = require('sheetify')
var partial = require('ap').partial
var List = require('observ-array')

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
    stack: List([]),
    index: Observ(-1)
  })

  App.push(state, Messages, 'messages')

  // Because we don't have a stack-based mobile router, we'll fake it for now.
  Messages.onMessage(state.messages, function (conversation) {
    state.chat.conversation.set(conversation)
    Navbar.push(state.navbar, {
      title: conversation.with.firstName
    })
    App.push(state, Chat, 'chat')
  })
  Navbar.onBack(state.navbar, function () {
    Navbar.pop(state.navbar)
    App.pop(state)
  })

  return state
}

App.render = function render (state) {
  return h('app', {className: sheet}, [
    Navbar.render(state.navbar),
    h('div.app-container', state.stack.map(function (data, index) {
      return data.Component.render(state[data.key], {
        transform: 'translate3d(' + data.position + '%,0,0)',
        display: (data.position === -100 || data.position === 100) ? 'none' : ''
      })
    }))
  ])
}

var Struct = require('observ-struct')
App.push = function push (state, Component, key) {
  var current = state.stack.get(state.index())
  var next = Struct({
    Component: Observ(Component),
    position: Observ(100),
    key: Observ(key)
  })

  var length = state.stack.push(next)
  state.index.set(length - 1)

  require('./components/navbar/animate')(next, {from: 100, to: 0})
  if (current) {
    require('./components/navbar/animate')(current, {from: 0, to: -100})
  }
}

App.pop = function pop (state) {
  var current = state.stack.get(state.index())
  var next = state.stack.get(state.index() - 1)

  state.index.set(state.index() - 1)

  if (current) {
    require('./components/navbar/animate')(current, {from: 0, to: 100}, remove)
  }
  if (next) {
    require('./components/navbar/animate')(next, {from: -100, to: 0})
  }

  function remove () {
    var index = state.stack.indexOf(current)
    if (index === -1) return

    state.stack.splice(index, 1)
  }
}
