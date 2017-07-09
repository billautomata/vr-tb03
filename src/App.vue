<template>
  <div id="app">
    <a-scene physics="debug: true;">
      <a-assets>
      </a-assets>

      <a-light color="white" type='point' position="0 4 2" intensity='2' distance='10'></a-light>

      <a-entity position="1 0 2">
         <a-entity camera look-controls-enabled='false' look-controls mouse-cursor wasd-controls></a-entity>
       </a-entity>

      <a-entity position='0 0 0'>
        <a-entity rotation='90 0 0'>
          <sequencer channel='1'></sequencer>
        </a-entity>
        <a-entity position='0 -0.3 0'>
          <synth midi-input-channel-selector="channel: 1;" audio-output-channel-selector="channel: 0;"></synth>
        </a-entity>
      </a-entity>

      <a-entity position='3 0 0'>
        <a-entity rotation='90 0 0'>
          <sequencer channel='2'></sequencer>
        </a-entity>
        <a-entity position='0 -0.3 0'>
          <synth midi-input-channel-selector="channel: 2;"  audio-output-channel-selector="channel: 4;"></synth>
        </a-entity>
      </a-entity>

      <a-entity position='-2 0 0'>
        <mixer></mixer>
      </a-entity>

      <a-entity position='1.5 -0.5 0'>
        <chorus audio-output-channel-selector="channel: 1;"></chorus>
      </a-entity>

      <!-- <sampler channel='2' note='34' sample='./audio/Clap 003.wav'></sampler>
      <sampler channel='2' note='35' sample='./audio/808 Bass A.WAV'></sampler> -->
    </a-scene>
  </div>
</template>

<script>
import { EventBus } from './event-bus.js'
import sequencer from './components/Sequencer.vue'
import synth from './components/Synth.vue'
import FMsynth from './components/FM-synth.vue'
import Sampler from './components/Sampler.vue'
import Mixer from './components/Mixer.vue'
import Chorus from './components/Chorus.vue'

console.warn = function(){}

// require('./slider-handle.js')
require('./slider-component.js')
require('./button-component.js')
require('./level-indicator-component.js')
require('./audio-output-channel-selector.js')
require('./midi-input-channel-selector.js')

export default {
  name: 'app',
  components: {
    'sequencer': sequencer,
    'synth': synth,
    'fm-synth': FMsynth,
    'sampler': Sampler,
    'mixer': Mixer,
    'chorus': Chorus
  },
  data () {
    return {
      started: true,
      audio_channels: [],
      midi_channels: []
    }
  },
  beforeCreate () {
    var self = this
    EventBus.$on('new-audio-channel', function (event) {
      console.log('new audio channels')
      self.audio_channels.push(event)
      console.log(event.channel_name)
    })

    AFRAME.registerComponent('controller', {
      init: function () {
        console.log('loaded controller')
      },
      tick: function(){
        return
      }
    });
  },
  mounted () {
    var self = this
    window.channels = self.audio_channels
    setTimeout(function() {
      Tone.Transport.start()
    }, 300)
  },
  methods : {
    indicate_change: function (evt) {
      console.log('changed!', evt.detail)
    }
  }
}
</script>

<style>
</style>
