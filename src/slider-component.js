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
    box.setAttribute('width', 0.1)
    box.setAttribute('height', 1.0)
    box.setAttribute('color', '#ccc')

    self.el.appendChild(handleEl)
    self.el.appendChild(box)

    self.sphere = handleEl

    self.el.object3D.userData.pos = self.sphere.object3D.position.y

    self.scale = d3.scaleLinear().domain([ 0.0, 1.0 ]).range([ -0.5, 0.5 ])

    self.el.addEventListener('override', function (evt) {
      // console.log('evt', evt)
       self.sphere.object3D.position.z = self.scale.invert(evt.detail)
    })

    self.el.emit('override', self.data.initialValue)
    return
  },
  tick: function () {
    var self = this
    self.sphere.object3D.position.x = 0
    self.sphere.object3D.position.z = 0

    // clamp the z
    self.sphere.object3D.position.y = Math.max(self.sphere.object3D.position.y, -0.5)
    self.sphere.object3D.position.y = Math.min(self.sphere.object3D.position.y, 0.5)

    // console.log(self.scale.invert(self.el.object3D.position.z))
    if (self.el.object3D.userData.pos !== self.sphere.object3D.position.y) {
      self.el.emit('changed', self.scale(self.el.object3D.userData.pos))
      self.el.object3D.userData.pos = self.sphere.object3D.position.y
    }
    //   // window.update_note(self.el.object3D)
    //   self.el.object3D.userData.value = self.scale(self.el.object3D.position.z)
    //   self.el.emit('changed', self.el.object3D.userData)
    //   self.el.object3D.userData.zpos = self.el.object3D.position.z
    //   console.log(self.el.object3D.userData.zpos, self.el.object3D.position.z - self.el.object3D.userData.zpos)
    // }

    return
  },
  update: function (old) {
    console.log(old)
  }
})
