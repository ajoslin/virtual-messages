var State = require('dover')
var update = require('update-struct')
var Observ = require('observ')
var partial = require('ap').partial
var List = require('observ-array')
var h = require('virtual-dom/h')
var extend = require('xtend')
var Event = require('weakmap-event')

var animate = require('./animate')
var Group = require('./group')

module.exports = Navbar

Navbar.Group = Group

function Navbar (data) {
  data = extend({
    back: true,
    stack: []
  }, data || {})

  var state = State({
    stack: List(data.stack.map(Group)),
    back: Observ(data.back ? '<' : null),
    index: Observ(data.index > -1 ? data.index : data.stack.length - 1),
    // Pointer to the previous group, aka the one animating out. This is not present in the stack.
    previous: Group(Group.EMPTY)
  })

  Group.onBack.toArray(state.stack, partial(BackEvent.broadcast, state))

  return state
}

var BackEvent = Event()
Navbar.onBack = BackEvent.listen

Navbar.render = function render (state, options) {
  var style = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: '40px',
    marginTop: window.cordova ? '20px' : '',
    borderBottom: '1px solid #eee',
    overflow: 'hidden'
  }
  var current = state.stack[state.index]

  return h('navbar', {style: style}, [
    !current ? undefined : Group.render(current),
    !state.previous ? undefined : Group.render(state.previous)
  ])
}

Navbar.bindHistory = function history (state, history) {
}

Navbar.push = function push (state, group, options) {
  var index = state.stack.getLength()
  state.stack.push(
    Group(extend(group, {index: index}))
  )
  Navbar.go(state, index)
}

Navbar.pop = function pop (state, options) {
  if (!state.stack.getLength()) return
  Navbar.go(state, state.index() - 1)
}

Navbar.go = function go (state, targetIndex, options) {
  targetIndex = Math.max(targetIndex, -1)
  var currentIndex = state.index()
  var current = state.stack.get(currentIndex)

  if (targetIndex === currentIndex) return

  animate.finish(current)

  // Set the properties of the previous group to the current group
  update(state.previous, currentIndex === -1
         ? Group.EMPTY
         : current())

  var previous = state.previous
  var target = state.stack.get(targetIndex)

  state.index.set(targetIndex)

  if (targetIndex > currentIndex) {
    // Push
    animate(target, {from: 100, to: 0})
    animate(previous, {from: 0, to: -100})
  } else {
    // Pop
    animate(target, {from: -100, to: 0})
    animate(previous, {from: 0, to: 100})

    onPop()
  }

  function onPop () {
    state.stack.transaction(function (array) {
      while (array.length - 1 > state.index()) array.pop()
    })
  }
}
