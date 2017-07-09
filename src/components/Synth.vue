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
var validOSCTypes = [ 'triangle', 'sine', 'square', 'sawtooth' ]

import { EventBus } from '../event-bus.js'

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
      midi_input_channel: 1,
      audio_output_channel: '',
      currentOSCTypeIndex: 0
    }
  },
  mounted () {
    console.log('synth mounted')
    this.synth = new Tone.Synth()

    window.synth = this.synth
    var self = this
    self.midi_input_channel = self.$el.getAttribute('channel')
    self.audio_output_channel = self.$el.getAttribute('audioChannel')
    console.log('synth midi channel', self.midi_input_channel)
    console.log('synth audio channel', self.audio_output_channel)
    self.synth.send(self.audio_output_channel)
    EventBus.$on(['channel-',self.midi_input_channel].join(''), function (evt) {
      self.synth.triggerAttackRelease(Tone.Frequency(evt.note, 'midi'), "16n", evt.time);
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
