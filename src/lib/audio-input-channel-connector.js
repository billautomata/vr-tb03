AFRAME.registerComponent('audio-input-channel-connector', {
  schema: {
    channel: {
      type: 'string',
      default: 'auto'
    }
  },
  init: function () {
    console.log('loaded audio-input-channel-connector', this.el.object3D.userData.synth, this.data.channel)

    this.el.object3D.userData.synth.receive(this.data.channel)
  },
  tick: function(){
    return
  },
  update: function () {
    // console.log('audio output channel selector update')
    // console.log(this.el.object3D.userData.synth)
    this.el.object3D.userData.synth.disconnect()
    this.el.object3D.userData.synth.receive(this.data.channel)
  }
});
