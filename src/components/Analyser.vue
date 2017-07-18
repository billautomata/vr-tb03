<template>
  <a-entity id='analyser'>
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <a-text value='ANALYSER' position='0.5 -0.85 0.1' rotation='0 0 0' scale='0.8 0.8 0.8' align='center'></a-text>
    <a-entity id='indicator-boxes'>
      <a-box v-for='(box,index) in indicator_boxes'
        :box="box" :index="index"
        :position="[scales['pos_x'](index), scales['pos_y'](box.v), '0.05'].join(' ')"
        color='white' :width="scales['pos_x'](1)" :height="scales['pos_x'](1)" :depth="scales['pos_x'](1)"></a-box>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
var crapuid = require('../crapuid.js')
import {EventBus} from '../event-bus.js'
export default {
  name: 'analyser',
  data () {
    return {
      type: 'fft',
      size: 128,
      indicator_boxes: [],
      scales: {}
    }
  },
  created () {
    var self = this
    this.scales['pos_x'] = d3.scaleLinear().domain([0,this.size]).range([0.0,0.9])
    this.scales['pos_y'] = d3.scaleLinear().domain([0,255]).range([-0.6,0.0])
    d3.range(0,this.size).forEach(function(b,i){
      self.indicator_boxes.push({
        v: 0
      })
    })
  },
  mounted () {
    var self = this
    console.log('analyser mounted')
    this.type = this.$el.getAttribute('analyser-type')
    if(this.type === 'waveform'){
      this.size = 1024
    }
    var synth = new Tone.Analyser(this.type, this.size)
    this.$el.synth = synth
    synth.channel_name = self.$el.getAttribute('inputChannelName')
    synth.name = [ 'analyser', crapuid() ].join('_')
    self.$nextTick(function () {
      self.$el.object3D.userData.synth = synth
      self.$el.object3D.userData.indicator_boxes = self.indicator_boxes
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
