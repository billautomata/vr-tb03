<template>
  <a-entity id='lfo'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='LFO' position='0.5 -0.85 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-box id='indicator'
        :level-indicator="['min: ', min, '; max: ', max, ';'].join('') + ' indicatorType: box;'"
        depth='0.1' width='0.1' position='0.03 0 0.01'></a-box>
      <a-entity v-on:changed="setAmplitude" :slider="['initialValue: ', scales['amplitude'].invert(amplitude), ';'].join('')" position='0.5 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='amplitude' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity v-on:changed="slideSet('min', $event)" :slider="['initialValue: ', scales['min'].invert(min), ';'].join('')" position='0.35 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='min' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity v-on:changed="slideSet('max', $event)" :slider="['initialValue: ', scales['max'].invert(max), ';'].join('')" position='0.2 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='max' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity v-on:changed="slideSet('frequency', $event)" :slider="['initialValue: ', scales['frequency'].invertExtent(frequency)[0], ';'].join('')" position='0.65 0.5 0.1' scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='frequency' rotation='0 0 90' align='center'></a-text>
      </a-entity>
    </a-entity>
    <a-entity butan="buttonType: momentary;" v-on:changed="resetLFO" position='0.1 -0.75 0.05'></a-entity>
    <a-entity butan="buttonType: toggle; initialValue: false;" v-on:changed="toggleStart" position='0.9 -0.75 0.05'></a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
window.d3 = d3
import {EventBus} from '../event-bus.js'
export default {
  name: 'lfo',
  data () {
    return {
      min: -100.0,
      max: 500,
      amplitude: 1,
      frequency: '1n',
      started: false,
      scales: {}
    }
  },
  created () {
    this.scales['amplitude'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,1.0])
    this.scales['frequency'] = d3.scaleQuantile().domain([0.0,1.0]).range(['1n', '2n', '4n', '8n', '16n'])
    this.scales['max'] = d3.scaleLinear().domain([0.0,1.0]).range([-1000.0,1000.0])
    this.scales['min'] = d3.scaleLinear().domain([0.0,1.0]).range([-1000.0,1000.0])
  },
  mounted () {
    console.log('lfo mounted')
    var self = this
    var synth = new Tone.LFO(this.frequency, this.min, this.max)
    synth.type = 'sine'
    // synth.start()
    var indicator = new Tone.Meter('frequency')
    synth.connect(indicator)
    synth.name = [ 'lfo', Number(Math.random()).toString(16).split('.')[1] ].join('_')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = synth
      self.$el.querySelector('#indicator').object3D.userData.indicator = indicator
      EventBus.$emit('new-lfo', synth)
    })
  },
  methods: {
    slideSet: function (field, event) {
      this[field] = this.scales[field](event.detail.value)
      this.$el.object3D.userData.synth.set(field, this.scales[field](event.detail.value))
    },
    setAmplitude: function (event) {
      this.amplitude = this.scales['amplitude'](event.detail.value)
      // console.log('setting amplitude', this.amplitude)
      this.$el.object3D.userData.synth.set('amplitude', this.scales['amplitude'](event.detail.value))
    },
    resetLFO: function () {
      console.log('reset lfo')
      this.$el.object3D.userData.synth.disconnect()
      this.$el.object3D.userData.synth.connect(this.$el.querySelector('#indicator').object3D.userData.indicator)
    },
    toggleStart: function () {
      var self = this
      this.started = !this.started
      if(this.started === true){
        self.$el.object3D.userData.synth.start()
      } else {
        self.$el.object3D.userData.synth.stop()
      }
    }
  }
}
</script>
