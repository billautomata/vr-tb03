<template>
  <a-entity id='distortion'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='DISTORTION' position='0 -0.75 0.1' rotation='0 0 0' align='left' scale='0.5 0.5 0.5'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity v-on:changed="setWetness" :slider="['initialValue: ',  synth.wet.get().value, ';'].join('')" position='0.5 0.5 0.1' scale='0.75 0.75 0.75'></a-entity>
      <a-entity v-on:changed="setDistortion" :slider="['initialValue: ', scales['distortion'].invert(synth.distortion),';'].join('')" position='0.75 0.5 0.1' scale='0.75 0.75 0.75'></a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'distortion',
  data () {
    return {
      synth: {
        wet: {
          get: function () {
            return 0
          }
        },
        distortion: 0
      },
      scales: {}
    }
  },
  created () {
    this.scales['wet'] = new d3.scaleLinear().domain([0.0,1.0]).range([0.0,1.0])
    this.scales['distortion'] = new d3.scaleLinear().domain([0.0,1.0]).range([0.0,30.0])
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
      console.log('set distortion wetness')
      this.synth.set('wet', event.detail.value)
    },
    setDistortion: function (event) {
      console.log('set distortion')
      this.synth.set('distortion', this.scales.distortion(event.detail.value))
    }
  }
}
</script>
