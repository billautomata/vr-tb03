<template>
  <a-entity id='duosynth'>
    <a-box width='2' height='2' depth='0.1' color='#bada55' position='1 -1 0'></a-box>
    <a-text value='DuoSynth' position='2 -0.11 0.05' rotation='0 0 0' align='right'></a-text>
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
      <a-entity  position='0.8 0.5 0.1' v-on:changed="slideSet('voice0.oscillator.type', $event)" :slider="['initialValue: ', scales['voice0.oscillator.type'].invertExtent(voice0.oscillator.type)[0], ';'].join('')" scale='0.75 0.75 0.75'>
        <a-text position='-0.12 0 0' value='osc 0' rotation='0 0 90' align='center'></a-text>
        <a-text position='0.12 0 0' :value="voice0.oscillator.type" rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.8 1.3 0.1' v-on:changed="slideSet('voice0.portamento', $event)" :slider="['initialValue: ', scales['voice0.portamento'].invert(voice0.portamento), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='osc0.portamento' rotation='0 0 90' align='center'></a-text>
      </a-entity>

      <a-entity  position='1.2 0.5 0.1' v-on:changed="slideSet('voice1.oscillator.type', $event)" :slider="['initialValue: ', scales['voice1.oscillator.type'].invertExtent(voice1.oscillator.type)[0], ';'].join('')" scale='0.75 0.75 0.75'>
        <a-text position='-0.12 0 0' value='osc 1' rotation='0 0 90' align='center'></a-text>
        <a-text position='0.12 0 0' :value="voice1.oscillator.type" rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='1.2 1.3 0.1' v-on:changed="slideSet('voice1.portamento', $event)" :slider="['initialValue: ', scales['voice1.portamento'].invert(voice1.portamento), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='osc1.portamento' rotation='0 0 90' align='center'></a-text>
      </a-entity>

    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
var crapuid = require('../crapuid.js')
import {EventBus} from '../event-bus.js'
export default {
  name: 'duosynth',
  props: [ '_preset', 'index', '_p' ],
  data () {
    return {
      registryType: 'DuoSynth',
      vibratoAmount: 0.5,
      vibratoRate: 0.1,
      harmonicity: 1.5,
      voice0: {
        oscillator: {
          type: 'square'
        },
        portamento: 0,
      },
      voice1: {
        oscillator: {
          type: 'triangle'
        },
        portamento: 0,
      },
      scales: {}
    }
  },
  created () {
    this.scales['vibratoAmount'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0, 2.0])
    this.scales['vibratoRate'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,0.5])
    this.scales['harmonicity'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0, 4])
    this.scales['voice0.oscillator.type'] = d3.scaleQuantile().domain([0.0,1.0]).range(['sine', 'triangle', 'square'])
    this.scales['voice1.oscillator.type'] = d3.scaleQuantile().domain([0.0,1.0]).range(['sine', 'triangle', 'square'])
    this.scales['voice0.portamento'] = d3.scaleLinear().domain([0.0,1.0]).range([0,2])
    this.scales['voice1.portamento'] = d3.scaleLinear().domain([0.0,1.0]).range([0,2])
  },
  mounted () {
    console.log('DuoSynth mounted')
    var self = this
    self.$el._p = this._p
    Object.freeze(this._p)
    var synth = new Tone.DuoSynth()
    self.$el.synth = synth
    synth.name = [ 'DuoSynth', self.$el.getAttribute('name') ].join('_')  // TODO: get the name from the attribute
    if(self._preset !== undefined){
      // how do I load the preset values from the prop if there is no slider doing the automatic update?
      console.log('there is a prop, running load preset with the prop information')
      // console.log(self)
      self.loadPreset(self, self._preset)
    }
    // self.$nextTick(function () {
    //   self.$el.object3D.userData.synth = synth
    //   EventBus.$emit('new-synth', synth)
    //   EventBus.$emit('new-lfo-input', { name: synth.name, synth: synth, field: 'harmonicity' })
    // })
  },
  methods: {
    slideSet: function (field, event) {
      // set the vue data
      var depth = field.split('.').length
      if(depth === 1){
        this[field] = this.scales[field](event.detail.value)
      } else if(depth === 2) {
        var f0 = field.split('.')[0]
        var f1 = field.split('.')[1]
        this[f0][f1] = this.scales[field](event.detail.value)
      } else if(depth === 3) {
        var f0 = field.split('.')[0]
        var f1 = field.split('.')[1]
        var f2 = field.split('.')[2]
        this[f0][f1][f2] = this.scales[field](event.detail.value)
      }
      // set the synth data
      this.$el.synth.set(field, this.scales[field](event.detail.value))
    }
  }
}
</script>
