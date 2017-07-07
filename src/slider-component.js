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
    self.setup = false

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
    self.scale = d3.scaleLinear().domain([ -0.5, 0.5 ]).range([ 0, 1 ])

    // set the initial condition of the slider
    self.el.object3D.userData.pos = -5
    // self.el.object3D.userData.pos = self.scale.invert(self.data.initialValue)
    // self.sphere.object3D.position.y = self.scale.invert(self.data.initialValue)
    console.log('initial position.y', self.sphere.object3D.position.y)

    self.el.addEventListener('override', function (evt) {
      // console.log('evt', evt)
      console.info('changed override called', evt)
      console.log('before position.y', self.sphere.object3D.position.y)
      console.info('changed override', self.scale.invert(evt.detail.value))
      self.sphere.object3D.position.y = self.scale.invert(evt.detail.value)
      console.log('new position.y', self.sphere.object3D.position.y)
      // self.el.object3D.userData.pos = self.sphere.object3D.position.y
    })
    return
  },
  tick: function () {
    var self = this
    if (self.setup === false) {
      self.setup = true
      self.el.emit('override', { value: self.data.initialValue })
    }
    // console.log(self.sphere.object3D)

    // clamp the x and z to zero
    self.sphere.object3D.position.x = 0
    self.sphere.object3D.position.z = 0

    // console.log(self.sphere.object3D.position.y)
    // clamp the y to the min/max
    self.sphere.object3D.position.y = Math.max(self.sphere.object3D.position.y, -0.5)
    self.sphere.object3D.position.y = Math.min(self.sphere.object3D.position.y, 0.5)
    // console.log(self.sphere.object3D.position.y)

    // console.log(self.scale.invert(self.el.object3D.position.z))
    if (self.el.object3D.userData.pos !== self.sphere.object3D.position.y) {
      console.log('discrepancy between (position.y, userData.pos)', self.sphere.object3D.position.y, self.el.object3D.userData.pos)
      // override the saved value with the space value
      self.el.object3D.userData.pos = self.sphere.object3D.position.y
      console.log('new changed slider values', self.sphere.object3D.position.y, self.el.object3D.userData.pos)
      self.el.emit('changed', { value: self.scale(self.el.object3D.userData.pos) })
    }
    return
  },
  update: function (old) {
    console.log(old)
  }
})
