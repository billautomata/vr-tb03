<template>
  <a-entity id='synth'>
    <a-box width='1' height='1' depth='0.1' color='#333' position='0.5 -0.5 0'></a-box>
    <a-box v-on:click='clicked' width='0.1' height='0.1' depth='0.1' color='teal' position='0.1 -0.1 0.05'></a-box>
    <a-text :value='["osc:", synth.oscillator.type].join(" ")' rotation='0 0 0' color='#F0F' position='0.15 -0.1 0.05' scale='0.4 0.4 0.4' align='left'></a-text>
    <a-entity position='0 -0.35 0.1'>
      <a-text value="ADSR" color='#FFF' rotation='0 0 0'></a-text>
      <a-entity position='0.1 0 0' scale='0.5 0.3 0.5'>
        <a-entity :slider="'initialValue: '+synth.envelope.attack+';'" v-on:changed="change_envelope('attack', $event)"></a-entity>
      </a-entity>
      <a-entity position='0.25 0 0' scale='0.5 0.3 0.5'>
        <a-entity :slider="'initialValue: '+synth.envelope.decay+';'" v-on:changed="change_envelope('decay', $event)"></a-entity>
      </a-entity>
      <a-entity position='0.40 0 0' scale='0.5 0.3 0.5'>
        <a-entity :slider="'initialValue: '+synth.envelope.sustain+';'" v-on:changed="change_envelope('sustain', $event)"></a-entity>
      </a-entity>
      <a-entity position='0.55 0 0' scale='0.5 0.3 0.5'>
        <a-entity :slider="'initialValue: '+synth.envelope.release+';'" v-on:changed="change_envelope('release', $event)"></a-entity>
      </a-entity>

      <a-entity position='0.5 -0.4 0' scale='0.75 0.75 0.75'>
        <a-entity rotation='0 0 -90'>
          <a-entity :slider="['initialValue: ',scales['filterEnvelope.baseFrequency'].invert(synth.filterEnvelope.baseFrequency),';'].join('')" v-on:changed="changeFilterFrequency">
            <a-text position='-0.12 0 0' value='fltr freq' rotation='0 0 90' align='center'></a-text>
          </a-entity>
        </a-entity>
      </a-entity>

    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
var crapuid = require('../crapuid.js')
import { EventBus } from '../event-bus.js'
var validOSCTypes = [ 'triangle', 'sine', 'square', 'sawtooth' ]

export default {
  name: 'synth',
  data () {
    return {
      synth: {
        oscillator: {
          type: ''
        },
        filter: {
          Q: 0
        },
        envelope: {
          attack: 0,
          decay: 0,
          sustain: 0,
          release: 0
        },
        filterEnvelope: {
          attack: 0,
          decay: 0,
          sustain: 0,
          release: 0,
          baseFrequency: 1000,
        },
      },
      currentOSCTypeIndex: 0,
      scales: {}
    }
  },
  created () {
    this.scales['filterEnvelope.baseFrequency'] = new d3.scaleLinear().domain([0.0,1.0]).range([100, 1000])
    this.scales['oscillator.detune'] = new d3.scaleLinear().domain([0.0,1.0]).range([1.0, 10.0])
  },
  mounted () {
    console.log('synth mounted')
    var self = this
    var synth = new Tone.MonoSynth()
    this.synth = synth
    synth.name = [ 'synth', crapuid() ].join('_')
    // assign the synth to the aframe object3d userdata so it can be used in components
    self.$nextTick(function () {
      console.log('assinging synth in next tick')
      self.$el.object3D.userData.synth = synth
      EventBus.$emit('new-lfo-input', { name: synth.name, synth: synth, field: 'oscillator.detune' })
    })
    // this.scales['filterEnvelope.baseFrequency'] = new d3.scaleLinear().domain([0,1]).range([100, 10000])
  },
  methods: {
    clicked: function () {
      console.log('clicked synth osc type button')
      this.currentOSCTypeIndex += 1
      this.currentOSCTypeIndex %= validOSCTypes.length
      this.synth.oscillator.type = validOSCTypes[this.currentOSCTypeIndex]
    },
    change_envelope : function (v, evt) {
      // console.log('changed envelope', v, evt, evt.detail.value)
      this.synth.envelope[v] = evt.detail.value
    },
    changeFilterFrequency: function (event){
      // console.log('change filter frequency', event.detail.value, this.scales['filterEnvelope.baseFrequency'](event.detail.value))
      this.synth.filterEnvelope.baseFrequency = this.scales['filterEnvelope.baseFrequency'](event.detail.value)
    },
    changeOscillatorDetune: function (event){
      console.log('change osc detune ', event.detail.value, this.scales['filterEnvelope.baseFrequency'](event.detail.value))
      this.synth.oscillator.set('detune', this.scales['oscillator.detune'](event.detail.value))
    }

  }
}
</script>
