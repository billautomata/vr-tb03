window.AFRAME.registerComponent('slider', {
  schema: {
    initialValue: {
      type: 'float',
      default: 0.9
    }
  },
  init: function () {
    var d3 = require('d3')
    var self = this
    console.log('loaded slider')
    console.log(self.el.id)

    var handleEl = document.createElement('a-sphere')
    handleEl.setAttribute('radius', 0.1)
    handleEl.setAttribute('color', '#F00')
    handleEl.setAttribute('click-drag', true)

    var box = document.createElement('a-box')
    box.setAttribute('depth', 0.05)
    box.setAttribute('width', 0.05)
    box.setAttribute('height', 1.0)
    box.setAttribute('color', '#ccc')

    self.el.appendChild(handleEl)
    self.el.appendChild(box)

    self.sphere = handleEl

    // set the initial condition of the
    self.el.object3D.userData.pos = self.sphere.object3D.position.y

    self.scale = d3.scaleLinear().domain([ -0.5, 0.5 ]).range([ 0, 1 ])

    self.el.addEventListener('override', function (evt) {
      // console.log('evt', evt)
       self.sphere.object3D.position.z = self.scale.invert(evt.detail)
    })

    self.el.emit('override', self.data.initialValue)
    return
  },
  tick: function () {
    var self = this

    // clamp the x and z to zero
    self.sphere.object3D.position.x = 0
    self.sphere.object3D.position.z = 0

    // clamp the y to the min/max
    self.sphere.object3D.position.y = Math.max(self.sphere.object3D.position.y, -0.5)
    self.sphere.object3D.position.y = Math.min(self.sphere.object3D.position.y, 0.5)

    // console.log(self.scale.invert(self.el.object3D.position.z))
    if (self.el.object3D.userData.pos !== self.sphere.object3D.position.y) {
      self.el.object3D.userData.pos = self.sphere.object3D.position.y
      self.el.emit('changed', { value: self.scale(self.el.object3D.userData.pos) })
    }
    return
  },
  update: function (old) {
    console.log(old)
  }
})
