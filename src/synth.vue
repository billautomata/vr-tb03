<template>
  <a-entity id='synth'>
    <a-box width='1' height='1' depth='0.1' color='#333' position='0.5 -0.5 0'></a-box>
    <a-box v-on:click='clicked' width='0.1' height='0.1' depth='0.1' color='teal' position='0.1 -0.1 0.05'></a-box>
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
    return {}
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
      synth.oscillator.type = validOSCTypes[currentOSCTypeIndex]
    }
  }
}
</script>
