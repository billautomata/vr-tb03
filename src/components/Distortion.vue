<template>
  <a-entity id='distortion'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='DISTORTION' position='0 -0.75 0.1' rotation='0 0 0' align='left' scale='0.5 0.5 0.5'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity v-on:changed="setWetness" slider='initialValue: 1;' position='0.5 0.5 0.1' scale='0.75 0.75 0.75'></a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
import {EventBus} from '../event-bus.js'
export default {
  name: 'distortion',
  data () {
    return {
      synth: {}
    }
  },
  mounted () {
    console.log('distortion mounted')
    var self = this
    self.synth = new Tone.Distortion(40.0)
    self.synth.channel_name = self.$el.getAttribute('inputChannelName')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = self.synth
      self.synth.receive(self.synth.channel_name)
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
