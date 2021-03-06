function __t (o) { return [ o.object3D.getWorldPosition().x, o.object3D.getWorldPosition().y, o.object3D.getWorldPosition().z ].join(' ') }
function __t2 (o) { return [ o.object3D.getWorldPosition().x + 1, o.object3D.getWorldPosition().y - 0.5, o.object3D.getWorldPosition().z ].join(' ') }
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
    self.el.object3D.position.set(self.el._p.x, self.el._p.y, self.el._p.z)
    console.log('loaded movable controller', self.el.getAttribute('id'), self.el.getAttribute('name'))
    var mover = document.createElement('a-box')
    mover.setAttribute('click-drag', true)
    mover.setAttribute('depth', 0.1)
    mover.setAttribute('height', 0.1)
    mover.setAttribute('width', 0.1)
    mover.setAttribute('position', [self.el._p.x, self.el._p.y, self.el._p.z].join(' '))
    mover.setAttribute('color', 'black')
    self.el.parentEl.appendChild(mover)
    mover.addEventListener('dragmove', function (event) {
      var o = event.detail.nextPosition
      var r = event.detail.nextRotation
      self.el.object3D.position.set(o.x, o.y, o.z)
      self.el.object3D.rotation.set(r.x, r.y, r.z)
      var type = self.el.getAttribute('id')
      var name = self.el.getAttribute('name')
      var elem = document.querySelector('a-entity#lines')
      var attrs = elem.attributes
      Object.keys(attrs).forEach(function (_z) {
        var attributeName = attrs[_z].name
        if (attributeName.indexOf('line__') === 0) {
          // parse this line for our guys name and id
          var a = elem.getAttribute(attributeName)
          if (attributeName.indexOf([type, name].join('_')) !== -1) {
            var s = attributeName.split('_')
            var p
            if (s[2] === type && s[3] === name) {
              p = __t(self.el).split(' ')
              // change the start
              a.end.x = Number(p[0])
              a.end.y = Number(p[1])
              a.end.z = Number(p[2])
            } else {
              // change the end
              p = __t2(self.el).split(' ')
              a.start.x = Number(p[0])
              a.start.y = Number(p[1])
              a.start.z = Number(p[2])
            }
            var _s = 'start: ' + [a.start.x, a.start.y, a.start.z].join(' ') + '; end: ' + [a.end.x, a.end.y, a.end.z].join(' ') + '; color: white;'
            var _m = console.log
            console.log = function () {}
            elem.removeAttribute(attributeName)
            elem.setAttribute(attributeName, _s)
            console.log = _m
          }
        }
      })
    })
    return
  },
  tick: function () {
    return
  }
})
