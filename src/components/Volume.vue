<template>
  <a-entity id='volume'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='Master' position='0.5 -0.85 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity rotation='0 0 -90'>
      <a-entity position='0.2 0.5 0.1' v-on:changed="slideSet('volume', $event)" :slider="['initialValue: ', scales['volume'].invert(volume), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='volume' rotation='0 0 90' align='center'></a-text>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'volume',
  props: [ '_preset', 'index', '_p' ],
  data () {
    return {
      registryType: 'volume',
      volume: 1,
      scales: {}
    }
  },
  created () {
    this.scales['volume'] = d3.scaleLinear().domain([0,1]).range([-100,0])
  },
  mounted () {
    console.log('volume mounted')
    var self = this
    self.$el._p = this._p
    Object.freeze(this._p)
    var synth = new Tone.Volume()
    synth.toMaster()
    self.$el.synth = synth
    synth.name = [ 'volume', self.$el.getAttribute('name') ].join('_')
    if(self.__preset !== undefined){
      self.loadPreset(self, self._preset)
    }
  },
  methods: {
    slideSet: function (field, event) {
      this[field] = this.scales[field](event.detail.value)
      console.log('slide set', field, this[field], event.detail.value)
      this.$el.synth.set(field, this.scales[field](event.detail.value))
    }
  }
}
</script>

<style>
</style>
