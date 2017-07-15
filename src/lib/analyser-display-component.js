AFRAME.registerComponent('analyser-display', {
  schema: {
    displayType: {
      type: 'string',
      default: 'fft'
    }
  },
  init: function () {
    console.log('loaded analyser-display')
    console.log(this.el.getAttribute('analyser-type'))
    if(this.el.getAttribute('analyser-type') !== null){
      this.data.displayType = this.el.getAttribute('analyser-type')
    }
    console.log(this.el.object3D.userData.synth)
    this.scale = 0
  },
  tick: function(){
    var self = this
    if(this.data.displayType === 'fft'){
      this.el.object3D.userData.synth.analyse().forEach(function(v,i){
        self.el.object3D.userData.indicator_boxes[i].v = v
      })
    } else {
      var t = this.el.object3D.userData.synth.analyse()
      var l = Math.floor(t.length / self.el.object3D.userData.indicator_boxes.length)
      self.el.object3D.userData.indicator_boxes.forEach(function(box,i){
        box.v = t[i*l]
      })
    }
    return
  }
});
