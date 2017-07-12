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
    self.setup = false

    var handleEl = document.createElement('a-box')
    handleEl.setAttribute('width', 0.15)
    handleEl.setAttribute('height', 0.15)
    handleEl.setAttribute('depth', 0.15)
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
    self.scale = d3.scaleLinear().domain([ -0.5, 0.5 ]).range([ 0, 1 ])

    // set the initial condition of the slider
    self.el.object3D.userData.pos = -5

    self.el.addEventListener('override', function (evt) {
      self.sphere.object3D.position.y = self.scale.invert(evt.detail.value)
    })
    return
  },
  tick: function () {
    var self = this
    if (self.setup === false) {
      self.setup = true
      self.el.emit('override', { value: self.data.initialValue })
      return
    }
    // clamp the x and z to zero
    self.sphere.object3D.position.x = 0
    self.sphere.object3D.position.z = 0
    // clamp the y to the min/max
    self.sphere.object3D.position.y = Math.max(self.sphere.object3D.position.y, -0.5)
    self.sphere.object3D.position.y = Math.min(self.sphere.object3D.position.y, 0.5)
    if (self.el.object3D.userData.pos !== self.sphere.object3D.position.y) {
      // override the saved value with the space value
      self.el.object3D.userData.pos = self.sphere.object3D.position.y
      self.el.emit('changed', { value: self.scale(self.el.object3D.userData.pos) })
    }
    return
  },
  update: function (old) {
    var self = this
    // console.log('update called', old)
    self.el.emit('override', { value: self.data.initialValue })
  }
})
