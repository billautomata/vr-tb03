<template>
  <a-entity id='eq3'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='EQ3' position='0.5 -0.85 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity position='0.2 0.5 0.1' v-on:changed="slideSet('low', $event)" :slider="['initialValue: ', scales['low'].invert(low), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='low' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity position='0.4 0.5 0.1' v-on:changed="slideSet('mid', $event)" :slider="['initialValue: ', scales['mid'].invert(mid), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='mid' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity position='0.6 0.5 0.1' v-on:changed="slideSet('high', $event)" :slider="['initialValue: ', scales['high'].invert(high), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='high' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <a-entity position='0.8 0.5 0.1' v-on:changed="setVolume($event)" :slider="['initialValue: ', scales['volume'].invert(volume), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='volume' rotation='0 0 90' align='center'></a-text>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'eq3',
  props: [ '_preset', 'index', '_p' ],
  data () {
    return {
      registryType: 'eq3',
      low: 0,
      mid: 0,
      high: 0,
      lowFrequency: 400,
      highFrequency: 2500,
      volume: 0,
      scales: {}
    }
  },
  created () {
    this.scales['low'] = d3.scaleLinear().domain([0,1]).range([-40,0])
    this.scales['mid'] = d3.scaleLinear().domain([0,1]).range([-40,0])
    this.scales['high'] = d3.scaleLinear().domain([0,1]).range([-40,0])
    this.scales['volume'] = d3.scaleLinear().domain([0,1]).range([-100,0])
    this.scales['volume_to_gain'] = d3.scaleLinear().domain([-100,0]).range([0,1])
  },
  mounted () {
    console.log('EQ3 mounted')
    var self = this
    self.$el._p = this._p
    Object.freeze(this._p)
    var synth = new Tone.EQ3()
    self.$el.synth = synth
    synth.name = [ 'eq3', self.$el.getAttribute('name') ].join('_')
    if(self.__preset !== undefined){
      self.loadPreset(self, self._preset)
    }
  },
  methods: {
    slideSet: function (field, event) {
      this[field] = this.scales[field](event.detail.value)
      console.log('slide set', field, this[field], event.detail.value)
      this.$el.synth.set(field, this.scales[field](event.detail.value))
    },
    setVolume: function (event) {
      this.volume = this.scales['volume'](event.detail.value)
      this.$el.synth.output.set('gain', this.scales['volume_to_gain'](this.scales['volume'](event.detail.value)))
    }
  }
}
</script>

<style>
</style>
