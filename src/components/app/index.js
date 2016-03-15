var State = require('dover')
var h = require('virtual-dom/h')
var sf = require('sheetify')
var partial = require('ap').partial

var Router = require('./router')
var Navbar = require('../navbar')
var Messages = require('../messages')
var Chat = require('../chat')

var sheet = sf('./index.css')

module.exports = App

function App (data) {
  data = data || {}

  var state = State({
    navbar: Navbar({stack: [{title: 'Messages'}]}),
    messages: Messages({list: data.messages}),
    chat: Chat(),
    router: Router()
  })

  // Because we don't have a stack-based mobile router
  state.chat.conversation(onConversation)
  state.router.path(onPath)
  Navbar.onBack(state.navbar, partial(state.router.path.set, '/'))

  Messages.onMessage(state.messages, function (conversation) {
    state.router.path.set('/chat/' + conversation.id)
  })

  Router.watch(state.router, state)

  return state

  function onConversation (conversation) {
    if (!conversation) return
    Navbar.push(state.navbar, {
      title: conversation.with.firstName
    })
  }

  function onPath (path) {
    console.log('PATH!~', path)
    if (/chat/.test(path)) return
    Navbar.pop(state.navbar)
  }
}

App.render = function render (state) {
  return h('app', {className: sheet}, [
    Navbar.render(state.navbar),
    Router.render(state.router)
    // Messages.render(state.messages)
  ])
}
