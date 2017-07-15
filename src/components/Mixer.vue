<template>
  <a-entity id='mixer'>
    <a-box depth='0.1' width='2' height='2' color="#cad" position='1 -1 0'>
      <a-text value='MIXER' position='0 -0.75 0.1' rotation='0 0 0' align='center'></a-text>
      <a-entity class='channel0' id='0' v-on:changed="setLevel" slider='initialValue: 0.1;' position='-0.75 0 0.1'></a-entity>
      <a-entity class='channel1' id='1' v-on:changed="setLevel" slider='initialValue: 0.2;' position='-0.25 0 0.1'></a-entity>
      <a-entity class='channel2' id='2' v-on:changed="setLevel" slider='initialValue: 0.3;' position='0.25 0 0.1'></a-entity>
      <a-entity class='channel3' id='3' v-on:changed="setLevel" slider='initialValue: 0.4;' position='0.75 0 0.1'></a-entity>
    </a-box>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import {EventBus} from '../event-bus.js'
export default {
  name: 'mixer',
  data () {
    return {
      eqs: [],
      meters: []
    }
  },
  props: [
    'mixer',
    'index'
  ],
  mounted () {
    var self = this
    console.log(this.$el.getAttribute('name'))
    var mixerName = this.$el.getAttribute('name')
    if(this.mixer === undefined){
      console.log('raw mixer no props')
    } else {
      console.log('props configed mixer')
      mixerName = this.mixer.name
    }
    d3.range(0,4).forEach(function(i){
      console.log('i', i)
      var eq = new Tone.EQ3()
      eq.receive([ mixerName, i ].join('_')).toMaster()
      eq.channel_name = [ mixerName, i ].join('_')
      self.eqs.push(eq)
      var meter = new Tone.Meter('level')
      self.meters.push(meter)
      eq.connect(meter)
    })
    // add the indicator geometry to the meters
    this.meters.forEach(function(meter,idx){
      var box_meter = document.createElement('a-box')
      box_meter.setAttribute('position', '0 0.6 0')
      box_meter.setAttribute('scale', '1 1 1')
      box_meter.setAttribute('width', 0.1)
      box_meter.setAttribute('depth', 0.1)
      box_meter.setAttribute('height', 1)
      box_meter.setAttribute('color', 'red')
      box_meter.setAttribute('level-indicator', true)
      box_meter.object3D.userData.indicator = meter
      self.$el.querySelector('a-entity.channel'+idx).appendChild(box_meter)
    })
    // publish the inputs
    this.eqs.forEach(function (m,idx) {
      console.log(m.channel_name)
      EventBus.$emit('new-audio-channel', m)
    })
  },
  methods: {
    setLevel: function (event) {
      this.eqs[Number(event.srcElement.id)].output.gain.set('value', event.detail.value)
    }
  }
}
</script>
