import {EventBus} from '../event-bus.js'

AFRAME.registerComponent('spawn-block', {
  init: function () {
    var self = this
    console.log('loaded spawn-block controller')
    var types = require('../scene_configuration_defaults.js').types
    var defaults = require('../scene_configuration_defaults.js').defaults
    console.log('types', types)
    types.forEach(function (t, i) {
      var m = document.createElement('a-box')
      m.setAttribute('depth', 0.1)
      m.setAttribute('width', 0.33)
      m.setAttribute('height', 0.33)
      m.setAttribute('position', [ -1.0, (i * 0.5) - (types.length * 0.25), 0 ].join(' '))
      m.addEventListener('click', function (event) {
        console.log('spawn click event', t)
        event.preventDefault()
        event.stopPropagation()
        // console.log('spawning', t, m.object3D.getWorldPosition())
        var o = JSON.parse(JSON.stringify(defaults[t]))
        var p = m.object3D.getWorldPosition()
        o.p = { x: p.x - 1.0, y: p.y, z: p.z }
        console.log('spawning', t, JSON.stringify(o))
        EventBus.$emit('spawn', { elementType: t, settings: JSON.parse(JSON.stringify(o)) })
      })
      var text = document.createElement('a-text')
      text.setAttribute('value', t)
      text.setAttribute('align', 'right')
      text.setAttribute('position', '-0.33 0 0')
      m.appendChild(text)
      self.el.appendChild(m)
    })
  },
  tick: function(){
    return
  }
});
