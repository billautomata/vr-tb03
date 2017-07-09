AFRAME.registerComponent('level-indicator', {
  init: function () {},
  tick: function () {
    var v = this.el.object3D.userData.indicator.get('value').value
    this.el.object3D.children[0].position.y = v * 0.5
    this.el.object3D.children[0].scale.y = v * 1.0
    return
  }
})
