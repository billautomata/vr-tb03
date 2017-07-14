<template>
  <a-entity id='DuoSynth'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='DuoSynth' position='0.5 -0.85 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity position='0.2 0.5 0.1' v-on:changed="slideSet('vibratoAmount', $event)" :slider="['initialValue: ', scales['vibratoAmount'].invert(vibratoAmount), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='vibratoAmount' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.35 0.5 0.1' v-on:changed="slideSet('vibratoRate', $event)" :slider="['initialValue: ', scales['vibratoRate'].invert(vibratoRate), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='vibratoRate' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.55 0.5 0.1' v-on:changed="slideSet('harmonicity', $event)" :slider="['initialValue: ', scales['harmonicity'].invert(harmonicity), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='harmonicity' rotation='0 0 90' align='center'></a-text>
        <!-- <a-text position='0.12 0 0' :value="type" rotation='0 0 90' align='center'></a-text> -->
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
var crapuid = require('../crapuid.js')
import {EventBus} from '../event-bus.js'
export default {
  name: 'DuoSynth',
  data () {
    return {
      vibratoAmount: 0.5,
      vibratoRate: 0.1,
      harmonicity: 1.5,
      scales: {}
    }
  },
  created () {
    this.scales['vibratoAmount'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0, 2.0])
    this.scales['vibratoRate'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,0.5])
    this.scales['harmonicity'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0, 4])
  },
  mounted () {
    console.log('DuoSynth mounted')
    var self = this
    var synth = new Tone.DuoSynth({
      vibratoRate: this.vibratoRate,
      vibratoAmount: this.vibratoAmount,
      harmonicity: this.harmonicity
    })
    synth.set('voice0.oscillator.type', 'triangle')
    synth.set('voice0.oscillator.type', 'square')
    synth.name = [ 'DuoSynth', crapuid() ].join('_')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = synth
      EventBus.$emit('new-synth', synth)
      EventBus.$emit('new-lfo-input', { name: synth.name, synth: synth, field: 'harmonicity' })
    })
  },
  methods: {
    slideSet: function (field, event) {
      this[field] = this.scales[field](event.detail.value)
      this.$el.object3D.userData.synth.set(field, this.scales[field](event.detail.value))
    }
  }
}
</script>
