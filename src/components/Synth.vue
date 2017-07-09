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
    </a-entity>
  </a-entity>
</template>

<script>
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
        envelope: {
          attack: 0,
          decay: 0,
          sustain: 0,
          release: 0
        }
      },
      currentOSCTypeIndex: 0,
    }
  },
  mounted () {
    console.log('synth mounted')
    var self = this
    this.synth = new Tone.Synth()
    // assign the synth to the aframe object3d userdata so it can be used in components
    self.$nextTick(function () {
      console.log('assinging synth in next tick')
      self.$el.object3D.userData.synth = self.synth
    })
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
    }
  }
}
</script>
