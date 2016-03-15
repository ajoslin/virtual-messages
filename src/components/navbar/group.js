var State = require('dover')
var Observ = require('observ')
var ObservClamp = require('observ-clamp')
var h = require('virtual-dom/h')
var clickEvent = require('value-event/click')
var Event = require('weakmap-event')

module.exports = Group

function Group (data) {
  data = data || {}
  return State({
    title: Observ(data.title || ''),
    index: Observ(data.index || -1),
    position: ObservClamp(data.position || 0, -100, 100),
    channels: {
      back: back
    }
  })
}

Group.EMPTY = Group()()

var BackEvent = Event()
Group.onBack = BackEvent.listen

function back (state) {
  BackEvent.broadcast(state, {})
}

Group.render = function render (state) {
  var style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    transform: 'translate3d(' + state.position + '%,0,0)',
    pointerEvents: 'none'
  }

  return h('div', {style: style}, [
    renderTitle(state.title),
    state.index <= 0 ? undefined : renderBack(state)
  ])
}

function renderBack (state) {
  var style = {
    border: 'none',
    color: '#337AF9',
    background: 'none',
    fontSize: '16px',
    pointerEvents: 'auto'
  }
  return h('button', {
    style: style,
    'ev-click': clickEvent(state.channels.back)
  }, '<')
}

function renderTitle (title) {
  var style = {
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  }
  return h('title', {style: style}, title)
}
