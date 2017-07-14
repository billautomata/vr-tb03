<template>
  <a-entity id='FMSynth'>
    <a-box width='1' height='1.5' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='FMSynth' position='0.5 0.1 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity position='0.2 0.5 0.1' v-on:changed="slideSet('detune', $event)" :slider="['initialValue: ', scales['detune'].invert(detune), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='detune' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.35 0.5 0.1' v-on:changed="slideSet('modulationIndex', $event)" :slider="['initialValue: ', scales['modulationIndex'].invert(modulationIndex), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='modulationIndex' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.55 0.5 0.1' v-on:changed="slideSet('harmonicity', $event)" :slider="['initialValue: ', scales['harmonicity'].invert(harmonicity), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='harmonicity' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.7 0.5 0.1' v-on:changed="slideSet('oscillator.type', $event)" :slider="['initialValue: ', scales['oscillator.type'].invertExtent(oscillator.type)[0], ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='osc type' rotation='0 0 90' align='center'></a-text>
        <a-text position='0.12 0 0' :value="oscillator.type" rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.95 0.5 0.1' v-on:changed="slideSet('modulation.type', $event)" :slider="['initialValue: ', scales['modulation.type'].invertExtent(modulation.type)[0], ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='mod type' rotation='0 0 90' align='center'></a-text>
        <a-text position='0.12 0 0' :value="modulation.type" rotation='0 0 90' align='center'></a-text>
      </a-entity>

    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
var crapuid = require('../crapuid.js')
import {EventBus} from '../event-bus.js'
export default {
  name: 'FMSynth',
  data () {
    return {
      detune: 0,
      modulationIndex: 1,
      harmonicity: 1.5,
      oscillator: {
        type: "sine"
      },
      modulation: {
        type: "square"
      },
      scales: {}
    }
  },
  created () {
    this.scales['detune'] = d3.scaleLinear().domain([0.0,1.0]).range([-500.0, 500.0])
    this.scales['modulationIndex'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,2])
    this.scales['harmonicity'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0, 4])
    this.scales['oscillator.type'] = d3.scaleQuantile().domain([0.0,1.0]).range(['sine', 'square', 'triangle', 'sawtooth'])
    this.scales['modulation.type'] = d3.scaleQuantile().domain([0.0,1.0]).range(['sine', 'square', 'triangle', 'sawtooth'])
  },
  mounted () {
    console.log('FMSynth mounted')
    var self = this
    var synth = new Tone.FMSynth({
      vibratoRate: this.vibratoRate,
      vibratoAmount: this.vibratoAmount,
      harmonicity: this.harmonicity
    })
    synth.name = [ 'FMSynth', crapuid() ].join('_')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = synth
      EventBus.$emit('new-synth', synth)
      EventBus.$emit('new-lfo-input', { name: synth.name, synth: synth, field: 'harmonicity' })
    })
  },
  methods: {
    slideSet: function (field, event) {
      if(field.indexOf('.') === -1){
        this[field] = this.scales[field](event.detail.value)
        this.$el.object3D.userData.synth.set(field, this.scales[field](event.detail.value))
      } else {
        this[field.split('.')[0]][field.split('.')[1]] = this.scales[field](event.detail.value)
        this.$el.object3D.userData.synth.set(field, this.scales[field](event.detail.value))
      }
    }
  }
}
</script>
