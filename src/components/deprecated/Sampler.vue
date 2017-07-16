<template>
  <a-entity id='sampler'></a-entity>
</template>

<script>
import { EventBus } from '../event-bus.js'
export default {
  name: 'sampler',
  data () {
    return {
      synth: {},
      midi_input_channel: -1,
      note: -1
    }
  },
  mounted () {
    var self = this
    if(window.sampler === undefined){
      window.sampler = this
    }
    this.synth = new Tone.Sampler(this.$el.getAttribute('sample'), function(){}).toMaster();
    console.log('sampler mounted')
    this.midi_input_channel = this.$el.getAttribute('channel')
    this.note = this.$el.getAttribute('note')
    EventBus.$on(['channel-',self.midi_input_channel].join(''), function (evt) {
      if(Number(evt.note) === Number(self.note)){
        self.synth.triggerAttackRelease(0, "8n", evt.time);
      }
    })
  }
}
</script>
