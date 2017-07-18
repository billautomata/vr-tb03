/* global AFRAME */
AFRAME.registerComponent('analyser-display', {
  schema: {
    displayType: {
      type: 'string',
      default: 'fft'
    }
  },
  init: function () {
    console.log('loaded analyser-display', this.data.displayType)
    console.log(this.el.synth, this.data.displayType)
    this.data.displayType = this.el.__vue__.$data.type
    this.scale = 0
  },
  tick: function () {
    var self = this
    if (this.data.displayType === 'fft') {
      this.el.synth.analyse().forEach(function (v, i) {
        self.el.indicator_boxes[i].v = v
      })
    } else {
      var t = this.el.synth.analyse()
      var l = Math.floor(t.length / self.el.indicator_boxes.length)
      self.el.indicator_boxes.forEach(function (box, i) {
        box.v = t[i * l]
      })
    }
    return
  }
})
