var h = require('virtual-dom/h')
var sf = require('sheetify')
var extend = require('xtend')

var sheet = sf('./index.css')

exports.render = function render (options, content) {
  options = extend({
    'ev-touchstart': onTouchStart
  }, options || {})

  return h('scroll.' + sheet, options, content)
}

// If a scroll starts right at the beginning or end of an overflow container on ios,
// it will actually scroll the body!
//
// The age old fix is to make all scrolls start at 1 from the top or bottom boundary
function onTouchStart (event) {
  var element = event.currentTarget
  var scrollTop = element.scrollTop

  if (scrollTop === 0) {
    element.scrollTop = 1
  } else if (scrollTop + element.offsetHeight === element.scrollHeight) {
    element.scrollTop -= 1
  }
}
