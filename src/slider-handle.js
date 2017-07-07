window.AFRAME.registerComponent('slider-handle', {
  schema: {
    initialValue: {
      type: 'float',
      default: 0.9
    }
  },
  init: function () {
    var d3 = require('d3')
    var self = this
    console.log('loaded lock-position')
    console.log(self.el.id)
    self.el.object3D.userData.dimension = 'z'
    self.el.object3D.userData.z_min = -0.3
    self.el.object3D.userData.z_max = 0.2
    self.el.object3D.userData.value = 0.2
    self.el.object3D.userData.step_index = Number(self.el.id.split('_')[1])
    self.scale = d3.scaleLinear().domain([ 0.2, -0.3 ]).range([ 0.0, 1.0 ])

    console.log(self.el.object3D.userData.step_index)
    self.el.object3D.userData.zpos = self.el.object3D.position.z

    self.el.addEventListener('override', function (evt) {
      console.log('evt', evt)
      // self.el.object3D.userData.zpos = self.scale()
      self.el.object3D.position.z = self.scale.invert(evt.detail)
    })

    self.el.emit('override', self.data.initialValue)
    // self.el.object3D.userData.dim_value = self.el.object3D.children
    return
  },
  tick: function () {
    var self = this
    window.z = self.el
    self.el.object3D.position.x = 0
    self.el.object3D.position.y = 0

    // console.log(self.scale.invert(self.el.object3D.position.z))
    if (self.el.object3D.userData.zpos !== self.el.object3D.position.z) {
      // window.update_note(self.el.object3D)
      self.el.object3D.userData.value = self.scale(self.el.object3D.position.z)
      self.el.emit('changed', self.el.object3D.userData)
      self.el.object3D.userData.zpos = self.el.object3D.position.z
      console.log(self.el.object3D.userData.zpos, self.el.object3D.position.z - self.el.object3D.userData.zpos)
    }

    // clamp the z
    self.el.object3D.position.z = Math.max(self.el.object3D.position.z, -0.3)
    self.el.object3D.position.z = Math.min(self.el.object3D.position.z, 0.2)
    return
  },
  update: function (old) {
    console.log(old)
  }
})
