<template>
  <a-entity id='filter'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='FILTER' position='0.5 -0.85 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity position='0.2 0.5 0.1' v-on:changed="slideSet('frequency', $event)" :slider="['initialValue: ', scales['frequency'].invert(frequency), ''].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='frequency' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity  position='0.35 0.5 0.1' v-on:changed="slideSet('Q', $event)" :slider="['initialValue: ', scales['Q'].invert(Q), ''].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='Q' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity position='0.55 0.5 0.1' v-on:changed="slideSet('type', $event)" :slider="['initialValue: ', scales['type'].invertExtent(type)[0], ''].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='type' rotation='0 0 90' align='center'></a-text>
        <a-text position='0.12 0 0' :value="''+type" rotation='0 0 90' align='center'></a-text>
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
      registryType: 'filter',
      frequency: 5120,
      Q: 1,
      type: 'lowpass',
      scales: {}
    }
  },
  props: [ '_preset', 'index', '_p' ],
  created () {
    this.scales['frequency'] = d3.scaleLinear().domain([0.0,1.0]).range([100.0,10000.0])
    this.scales['Q'] = d3.scaleLinear().domain([0.0,1.0]).range([0.0,20.0])
    this.scales['type'] = d3.scaleQuantile().domain([0.0,1.0]).range(['lowpass', 'bandpass', 'highpass'])
  },
  updated () {
  },
  mounted () {
    console.log('filter mounted')
    var self = this
    self.$el._p = this._p
    Object.freeze(this._p)
    var synth = new Tone.Filter()
    synth.network_on = true
    self.$el.synth = synth
    synth.name =  [ 'filter', self.$el.getAttribute('name') ].join('_')
    if(self._preset !== undefined){
      // how do I load the preset values from the prop if there is no slider doing the automatic update?
      console.log('there is a prop, running load preset with the prop information')
      console.log(self)
      self.loadPreset(self, self._preset)
    }
    // EventBus.$emit('new-synth', synth)          // add me to the list of things
    EventBus.$emit('new-lfo-input', { name: synth.name, synth: synth, field: 'frequency' })
  },
  methods: {
    slideSet: function (field, event) {
      this[field] = this.scales[field](event.detail.value)
      var self = this
      console.log('slide set', field, this[field], event.detail.value, self.$el.synth.network_on)
      if(self.$el.synth.network_on === true){
        console.log('emitting element update')
        EventBus.$emit('element-updated', {
          type: self.$el.getAttribute('id'),
          name: self.$el.getAttribute('name'),
          preset: self.getPresetValuesFromVueInstance()
        })
      }
      this.$el.synth.set(field, this.scales[field](event.detail.value))
    }
  }
}
</script>
