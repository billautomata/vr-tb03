<template>
  <a-entity id='lfo'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='LFO' position='0.5 -0.75 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-box id='indicator' level-indicator="min: 0.0; max: 10.0;" depth='0.1' width='0.1' position='0.1 0 0.01'></a-box>
      <!-- <a-entity v-on:changed="setFrequency" :slider="['initialValue: ', scales['frequency'].invert(frequency), ';'].join('')" position='0.1 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text value='frequency' rotation='0 0 90' align='center'></a-text>
      </a-entity> -->
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'lfo',
  data () {
    return {
      frequency: 512,
      scales: {}
    }
  },
  created () {
    // this.scales['frequency'] = d3.scaleLinear().domain([0.0,1.0]).range([100.0,1000.0])
  },
  mounted () {
    console.log('lfo mounted')
    var self = this
    var synth = new Tone.LFO('1n', 0, 1)
    synth.start()
    var indicator = new Tone.Meter('frequency')
    synth.connect(indicator)
    synth.name = [ 'filter', Number(Math.random()).toString(16).split('.')[1] ].join('_')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = synth
      self.$el.querySelector('#indicator').object3D.userData.indicator = indicator
      EventBus.$emit('new-lfo', synth)
    })
  },
  methods: {
    setFrequency: function (event) {
      // console.log('set frequency event', event.detail.value)
      // this.$el.object3D.userData.synth.frequency.value = this.scales['frequency'](event.detail.value)
    }
  }
}
</script>
