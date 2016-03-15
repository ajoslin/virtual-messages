var Sour = require('sour')
var Messages = require('../messages')
var Chat = require('../chat')

module.exports = Router

function Router (options) {
  return Sour(options)
}

Router.watch = function watch (router, app) {
  var chat = Sour.route(router, {
    path: '/chat/:id',
    render: function () {
      return Chat.render(app.chat())
    }
  })
  Sour.route(router, {
    path: '/',
    title: 'Messages',
    render: function () {
      return Messages.render(app.messages())
    }
  })

  Sour.hook(router, chat, function (params, callback) {
    app.chat.conversation.set(Messages.get(app.messages, params.id))
    callback()
  })

  return Sour.watch(router)
}

Router.render = Sour.render
