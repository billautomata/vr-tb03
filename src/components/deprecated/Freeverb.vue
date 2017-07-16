<template>
  <a-entity id='freeverb'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='freeverb' position='0 -0.75 0.1' rotation='0 0 0' align='left'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity v-on:changed="setWetness" :slider="['initialValue: ', synth.wet.get().value, ';'].join('')" position='0.5 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='wetness' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity v-on:changed="setRoomSize" :slider="['initialValue: ', synth.roomSize.value, ';'].join('')" position='0.3 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='roomSize' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity v-on:changed="setDampening" :slider="['initialValue: ', scales['dampening'].invert(synth.dampening.value), ';'].join('')" position='0.1 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='dampening' rotation='0 0 90' align='center'></a-text>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'freeverb',
  data () {
    return {
      synth: {
        wet: {
          get: function (){
            return {
              value: 0
            }
          }
        },
        dampening: {
          get: function (){
            return {
              value: 0
            }
          }
        },
        roomSize: {
          get: function (){
            return {
              value: 0
            }
          }
        }
      },
      scales: {}
    }
  },
  created () {
    this.scales['wet'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,1.0])
    this.scales['roomSize'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,1.0])
    this.scales['dampening'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,10000.0])
  },
  mounted () {
    console.log('freeverb mounted')
    var self = this
    self.synth = new Tone.Freeverb(0.5, 5000)
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
    },
    setRoomSize: function (event) {
      this.synth.set('roomSize', this.scales['roomSize'](event.detail.value))
    },
    setDampening: function (event) {
      console.log(event.detail.value)
      console.log('set depth', event.detail.value)
      this.synth.set('dampening', this.scales['dampening'](event.detail.value))
    }
  }
}
</script>
