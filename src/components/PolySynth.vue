<template>
  <a-entity id='polysynth'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='PolySynth' position='0 -0.75 0.1' rotation='0 0 0' align='left'></a-text>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'polysynth',
  data () {
    return {
      scales: {}
    }
  },
  created () {
    this.scales['frequency'] = d3.scaleLinear().domain([0.0,1.0]).range([100.0,10000.0])
  },
  mounted () {
    console.log('filter mounted')
    var self = this
    var synth = new Tone.PolySynth()
    synth.channel_name = self.$el.getAttribute('inputChannelName')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = synth
    })
  },
  methods: {}
}
</script>
