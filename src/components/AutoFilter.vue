<template>
  <a-entity id='autofilter'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='AUTOFILTER' position='0.5 -0.85 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity position='0.2 0.5 0.1' v-on:changed="slideSet('baseFrequency', $event)" :slider="['initialValue: ', scales['baseFrequency'].invert(baseFrequency), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='filter.frequency' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.35 0.5 0.1' v-on:changed="slideSet('filter.Q', $event)" :slider="['initialValue: ', scales['filter.Q'].invert(filter.Q), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='Q' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.55 0.5 0.1' v-on:changed="slideSet('filter.type', $event)" :slider="['initialValue: ', scales['filter.type'].invertExtent(filter.type)[0], ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='filter.type' rotation='0 0 90' align='center'></a-text>
        <a-text position='0.12 0 0' :value="filter.type" rotation='0 0 90' align='center'></a-text>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
var crapuid = require('../crapuid.js')
import {EventBus} from '../event-bus.js'
export default {
  name: 'filter',
  data () {
    return {
      registryType: 'autofilter',
      frequency: '1n',
      type: 'sine',
      baseFrequency: 200,
      depth: 1,
      octaves: 2.6,
      filter: {
        Q: 1,
        type: 'lowpass',
        rolloff: -12
      }
      scales: {}
    }
  },
  created () {
    this.scales['baseFrequency'] = d3.scaleLinear().domain([0.0,1.0]).range([100.0,10000.0])
    this.scales['filter.Q'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,20.0])
    this.scales['filter.type'] = d3.scaleQuantile().domain([0.0,1.0]).range(['lowpass', 'bandpass', 'highpass'])
  },
  mounted () {
    console.log('auto filter mounted')
    var self = this
    var synth = new Tone.AutoFilter()
    synth.channel_name = self.$el.getAttribute('inputChannelName')
    var object_name = self.$el.getAttribute('name')
    if(object_name === null){
      object_name = [ 'autofilter', crapuid() ].join('_')
    } else {
      object_name = [ 'autofilter', object_name ].join('_')
    }
    synth.name = object_name
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = synth
      synth.receive(synth.channel_name)           // move to audio-input-channel-selector component
      EventBus.$emit('new-synth', synth)          // add me to the list of things
      EventBus.$emit('new-audio-channel', synth)  // add me to the list of audio inputs
      // add 'frequency' and my synth object to the list of available LFO targets
      // EventBus.$emit('new-lfo-input', { name: synth.name, synth: synth, field: 'brequency' })
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
