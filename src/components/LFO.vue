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
    <a-entity butan="buttonType: momentary;" v-on:changed="resetLFO" position='0.2 -0.8 0.05'></a-entity>
    <a-entity butan="buttonType: toggle; initialValue: false;" v-on:changed="toggleStart" position='0.8 -0.8 0.05'></a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
window.d3 = d3
import {EventBus} from '../event-bus.js'
export default {
  name: 'lfo',
  props: [ '_preset', 'index', '_p' ],
  data () {
    return {
      registryType: 'lfo',
      min: -100.0,
      max: 500,
      amplitude: 1,
      frequency: '1n',
      _started: false,
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
    self.$el._p = this._p
    Object.freeze(this._p)
    var synth = new Tone.LFO()
    self.$el.synth = synth
    synth.type = 'sine'
    if(self._preset !== undefined){
      // how do I load the preset values from the prop if there is no slider doing the automatic update?
      console.log('there is a prop, running load preset with the prop information')
      console.log(self)
      self.loadPreset(self, self._preset)
    }
    // synth.start()
    var indicator = new Tone.Meter('frequency')
    synth.connect(indicator)
    synth.name = [ 'lfo', self.$el.getAttribute('name') ].join('_')
    self.$nextTick(function () {
      self.$el.querySelector('#indicator').object3D.userData.indicator = indicator
    })
  },
  methods: {
    slideSet: function (field, event) {
      this[field] = this.scales[field](event.detail.value)
      this.$el.synth.set(field, this.scales[field](event.detail.value))
    },
    setAmplitude: function (event) {
      this.amplitude = this.scales['amplitude'](event.detail.value)
      // console.log('setting amplitude', this.amplitude)
      this.$el.synth.set('amplitude', this.scales['amplitude'](event.detail.value))
    },
    resetLFO: function () {
      console.log('reset lfo')
      this.$el.synth.disconnect()
      this.$el.synth.connect(this.$el.querySelector('#indicator').object3D.userData.indicator)
    },
    toggleStart: function () {
      var self = this
      this._started = !this._started
      if(this._started === true){
        self.$el.synth.start()
      } else {
        self.$el.synth.stop()
      }
    }
  }
}
</script>
