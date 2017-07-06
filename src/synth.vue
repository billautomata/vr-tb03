<template>
  <a-entity id='synth'>
  </a-entity>
</template>

<script>
var synth = new Tone.Synth().toMaster();
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
  }
}
</script>
