AFRAME.registerComponent('analyser-display', {
  init: function () {
    console.log('loaded analyser-display')
    console.log(this.el.object3D.userData.synth)
  },
  tick: function(){
    var self = this
    this.el.object3D.userData.synth.analyse().forEach(function(v,i){
      self.el.object3D.userData.indicator_boxes[i].v = v
    })
    return
  }
});
