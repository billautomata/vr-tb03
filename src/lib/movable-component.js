function __t (o) { return [ o.object3D.getWorldPosition().x, o.object3D.getWorldPosition().y, o.object3D.getWorldPosition().z ].join(' ') }
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
              p = __t(self.el).split(' ')
              a.start.x = Number(p[0])
              a.start.y = Number(p[1])
              a.start.z = Number(p[2])
            }
            var _s = 'start: ' + [a.start.x, a.start.y, a.start.z].join(' ') + '; end: ' + [a.end.x, a.end.y, a.end.z].join(' ') + '; color: white;'
            elem.removeAttribute(attributeName)
            elem.setAttribute(attributeName, _s)
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
