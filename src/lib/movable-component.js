// component that listens for midi channel messages and triggers the synth
import {EventBus} from '../event-bus.js'

window.AFRAME.registerComponent('movable', {
  schema: {
    channel: {
      type: 'string',
      default: 'auto'
    }
  },
  init: function () {
    var self = this
    console.log('loaded movable controller')
    window.m = self
    var mover = document.createElement('a-box')
    mover.setAttribute('click-drag', true)
    mover.setAttribute('depth', 0.1)
    mover.setAttribute('height', 0.1)
    mover.setAttribute('width', 0.1)
    mover.setAttribute('position', '0 0 0')
    mover.setAttribute('color', 'black')
    self.el.parentEl.appendChild(mover)
    mover.addEventListener('dragmove', function (event) {
      var o = event.detail.nextPosition
      var r = event.detail.nextRotation
      mover.object3D.position.set(0, 0, 0)
      mover.object3D.rotation.set(0, 0, 0)      
      self.el.object3D.position.set(o.x, o.y, o.z)
      self.el.object3D.rotation.set(r.x, r.y, r.z)
    })
    return
  },
  tick: function () {
    return
  }
})
