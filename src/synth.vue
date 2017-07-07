<template>
  <a-entity id='synth'>
    <a-box width='1' height='1' depth='0.1' color='#333' position='0.5 -0.5 0'></a-box>
    <a-box v-on:click='clicked' width='0.1' height='0.1' depth='0.1' color='teal' position='0.1 -0.1 0.05'></a-box>
    <a-text :value='["osc:", oscillator.type].join(" ")' rotation='0 0 0' color='#F0F' position='0.15 -0.1 0.05' scale='0.4 0.4 0.4' align='left'></a-text>
    <a-entity position='0 0.0 0.1' scale='0.5 0.3 0.5'>
      <a-entity :slider="'initialValue: '+envelope.attack+';'" v-on:changed="change_envelope('attack', $event)"></a-entity>
    </a-entity>

  </a-entity>

</template>

<script>
var synth = new Tone.Synth().toMaster();

var validOSCTypes = [ 'triangle', 'sine', 'square', 'sawtooth' ]
var currentOSCTypeIndex = 0

import { EventBus } from './event-bus.js'

export default {
  name: 'synth',
  data () {
    return {
      oscillator: synth.oscillator,
      envelope: synth.envelope
    }
  },
  mounted () {
    console.log('synth mounted')
    window.k = synth

    EventBus.$on('play-note', function (evt) {
      // console.log(evt)
      synth.triggerAttackRelease(Tone.Frequency(evt.note, 'midi'), "16n", evt.time);
    })
  },
  methods: {
    clicked: function () {
      console.log('clicked synth')
      currentOSCTypeIndex += 1
      currentOSCTypeIndex %= validOSCTypes.length
      this.oscillator.type = validOSCTypes[currentOSCTypeIndex]
    },
    change_envelope : function (v, evt) {
      console.log('change envelope', v, evt)
      this.envelope[v] = evt.detail.value
      // console.log(this.el.userData)
    }
  }
}
</script>
