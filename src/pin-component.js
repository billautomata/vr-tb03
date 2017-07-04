window.AFRAME.registerComponent('pin', {
  init: function () {
    var self = this
    console.log('loaded pin')
    self.el.object3D.userData.tipped = false
    return
    setInterval(function () {
      window.k = self.el.body
      // console.log([self.el.body.velocity.x, self.el.body.velocity.y, self.el.body.velocity.z].map(function (o) { return Number(o).toFixed(2) }).join('\t'))
      // console.log(self.el.body.velocity.length().toFixed(2))
      // console.log(self.el.body.quaternion.toArray().map(function (o) { return Number(Math.abs(o)).toFixed(2) }).join('\t'), Number(self.el.body.quaternion.toAxisAngle()[1]).toFixed(2))
    }, 1000)
  },
  tick: function () {
    var self = this
    window.z = self.el
    if (self.el.object3D.userData.tipped === false && self.el.body !== undefined && self.el.body.quaternion.toAxisAngle()[1] > 1.0) {
      self.el.object3D.userData.tipped = true
      // window.z.object3D.children[0].children[0].material.color = new window.THREE.Color(1, 0, 0)
    }
    return
  }
})
