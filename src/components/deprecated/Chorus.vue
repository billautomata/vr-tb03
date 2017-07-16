<template>
  <a-entity id='chorus'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='CHORUS' position='0 -0.75 0.1' rotation='0 0 0' align='left'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity v-on:changed="setWetness" :slider="['initialValue: ', synth.wet.get().value, ';'].join('')" position='0.5 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='wetness' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity v-on:changed="setDepth" :slider="['initialValue: ', synth.depth, ';'].join('')" position='0.3 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='depth' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity v-on:changed="setFrequency" :slider="['initialValue: ', scales['frequency'].invert(synth.frequency.value), ';'].join('')" position='0.1 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='frequency' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity v-on:changed="setFeedback" :slider="['initialValue: ', scales['feedback'].invert(synth.feedback.value), ';'].join('')" position='0.71 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='feedback' rotation='0 0 90' align='center'></a-text>
      </a-entity>

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
            return {
              value: 0
            }
          }
        },
        depth: {
          get: function (){
            return {
              value: 0
            }
          }
        },
        feedback: {
          get: function (){
            return {
              value: 0
            }
          }
        },
        frequency: {
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
    this.scales['frequency'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,5.0])
    this.scales['wet'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,1.0])
    this.scales['depth'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,1.0])
    this.scales['feedback'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,0.1])
  },
  mounted () {
    console.log('chorus mounted')
    var self = this
    self.synth = new Tone.Chorus(3, 3, 0.5)
    self.synth.channel_name = self.$el.getAttribute('inputChannelName')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = self.synth
      console.log('frequency', self.synth.frequency)
      self.synth.receive(self.synth.channel_name)
      EventBus.$emit('new-audio-channel', self.synth)
    })
  },
  methods: {
    setWetness: function (event) {
      console.log(event.detail.value)
      this.synth.set('wet', this.scales['wet'](event.detail.value))
    },
    setFrequency: function (event) {
      console.log(event.detail.value)
      console.log('set frequency', event.detail.value)
      this.synth.set('frequency', this.scales['frequency'](event.detail.value))
    },
    setDepth: function (event) {
      console.log(event.detail.value)
      console.log('set depth', event.detail.value)
      this.synth.set('depth', this.scales['depth'](event.detail.value))
    },
    setFeedback: function (event) {
      console.log(event.detail.value)
      console.log('set feedback', event.detail.value)
      this.synth.set('feedback', this.scales['feedback'](event.detail.value))
    },
  }
}
</script>
