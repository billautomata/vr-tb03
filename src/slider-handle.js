window.AFRAME.registerComponent('slider-handle', {
  init: function () {
    var self = this
    console.log('loaded lock-position')
    console.log(self.el.id)
    self.el.object3D.userData.dimension = 'z'
    self.el.object3D.userData.z_min = -0.3
    self.el.object3D.userData.z_max = 0.2
    self.el.object3D.userData.step_index = Number(self.el.id.split('_')[1])
    console.log(self.el.object3D.userData.step_index)
    self.el.object3D.userData.zpos = self.el.object3D.position.z

    self.el.addEventListener('override', function (evt) {
      console.log('evt', evt)
      // self.el.object3D.userData.zpos = self.scale()
    })
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
      self.el.emit('changed', self.el.object3D)
      self.el.object3D.userData.zpos = self.el.object3D.position.z
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
