var Tween = require('micro-tween')
var Store = require('weakmap-shim/create-store')
var ease = require('micro-tween/ease/cubicInOut')

var Animations = Store()
var duration = 350

module.exports = animate

animate.finish = finish

function animate (navGroup, options) {
  if (!navGroup) return

  var animation = Animations(navGroup).data = tween()
  return animation

  function tween () {
    return Tween({x: navGroup.position() || options.from})
      .to({x: options.to})
      .duration(duration)
      .ease(ease)
      .onStart(update)
      .onUpdate(update)
      .start()

    function update (data) {
      navGroup.position.set(data.x)
    }
  }
}

function finish (navGroup) {
  if (!navGroup) return

  var animation = Animations(navGroup).data
  if (!animation) return

  // Finish the animation
  animation.update(Date.now() + duration)
}
