window.AFRAME.registerComponent('level-indicator', {
  schema: {
    min: { type: 'number', default: 0.0 },
    max: { type: 'number', default: 1.0 },
    indicatorType: { type: 'string', default: 'default' }
  },
  init: function () {
    var d3 = require('d3')
    this.default_bevahior = true
    if (this.data.min !== 0.0 || this.data.max !== 0.0) {
      this.default_behavior = false
      // this.scale = d3.scaleLinear().domain([ this.data.min, this.data.max ]).range([ 0.0, 1.0 ])
    }
  },
  tick: function () {
    return this.indicate()
  },
  update: function () {
    var d3 = require('d3')
    this.scale = d3.scaleLinear().domain([ this.data.min, this.data.max ]).range([ 0.0, 1.0 ])
  },
  indicate: function () {
    var v = this.el.object3D.userData.indicator.get('value').value
    if (this.default_behavior === true) {
      this.el.object3D.children[0].position.y = v * 0.5
      this.el.object3D.children[0].scale.y = v * 1.0
    } else {
      if(this.data.indicatorType === 'default'){
        this.el.object3D.children[0].position.y = this.scale(v) * 0.5
        this.el.object3D.children[0].scale.y = this.scale(v) * 1.0
      } else {
        this.el.object3D.children[0].position.y = this.scale(v)
        this.el.object3D.children[0].scale.y = 0.1
      }
    }
  }
})
