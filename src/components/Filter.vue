<template>
  <a-entity id='filter'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='FILTER' position='0 -0.75 0.1' rotation='0 0 0' align='left'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity v-on:changed="setFrequency" :slider="['initialValue: ', scales['frequency'].invert(frequency), ';'].join('')" position='0.1 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='frequency' rotation='0 0 90' align='center'></a-text>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'filter',
  data () {
    return {
      frequency: 512,
      scales: {}
    }
  },
  created () {
    this.scales['frequency'] = d3.scaleLinear().domain([0.0,1.0]).range([100.0,1000.0])
  },
  mounted () {
    console.log('filter mounted')
    var self = this
    var synth = new Tone.Filter()
    synth.channel_name = self.$el.getAttribute('inputChannelName')
    synth.name = [ 'filter', Number(Math.random()).toString(16).split('.')[1] ].join('_')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = synth
      console.log('frequency', synth.frequency)
      synth.receive(synth.channel_name)
      EventBus.$emit('new-audio-channel', synth)
      EventBus.$emit('new-synth', synth)
    })
  },
  methods: {
    setFrequency: function (event) {
      console.log('set frequency event', event.detail.value)
      this.$el.object3D.userData.synth.frequency.value = this.scales['frequency'](event.detail.value)
    }
  }
}
</script>
