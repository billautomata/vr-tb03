<template>
  <a-entity id='chorus'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='CHORUS' position='0 -0.75 0.1' rotation='0 0 0' align='left'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity v-on:changed="setWetness" :slider="['initialValue: ', synth.wet.get().value, ';'].join('')" position='0.5 0.5 0.1' scale='0.5 0.5 0.5'></a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'chorus',
  data () {
    return {
      synth: {
        wet: {
          get: function (){
            return 0
          }
        }
      },
      scales: {}
    }
  },
  created () {
    this.scales['wet'] = new d3.scaleLinear().domain([0.0,1.0]).range([0.0,1.0])
  },
  mounted () {
    console.log('chorus mounted')
    var self = this
    self.synth = new Tone.Chorus(4, 2.5, 0.5)
    self.synth.channel_name = self.$el.getAttribute('inputChannelName')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = self.synth
      self.synth.receive(self.synth.channel_name)
      EventBus.$emit('new-audio-channel', self.synth)
    })
  },
  methods: {
    setWetness: function (event) {
      console.log(event.detail.value)
      this.synth.set('wet', this.scales['wet'](event.detail.value))
    }
  }
}
</script>
