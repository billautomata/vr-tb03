<template>
  <a-entity id='chorus'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='CHORUS' position='0 -0.75 0.1' rotation='0 0 0' align='left'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity v-on:changed="setWetness" slider='initialValue: 1;' position='0.5 0.5 0.1' scale='0.5 0.5 0.5'></a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
import {EventBus} from '../event-bus.js'
export default {
  name: 'chorus',
  data () {
    return {
      synth: {}
    }
  },
  mounted () {
    console.log('chorus mounted')
    var self = this
    this.synth = new Tone.Chorus(4, 2.5, 0.5)
    // self.synth = new Tone.Distortion(40.0)
    window.rrr = self.synth
    self.synth.channel_name = 'chorus0'
    // window.synth = self.synth
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = self.synth
      self.synth.receive('chorus0')
      EventBus.$emit('new-audio-channel', self.synth)
    })
  },
  methods: {
    setWetness: function (event) {
      this.synth.set('wet', event.detail.value)
    }
  }
}
</script>
