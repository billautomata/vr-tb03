<template>
  <div id="app">
    <a-scene physics="debug: true;" >
      <a-assets>
      </a-assets>

      <a-light color="white" type='point' position="0 4 2" intensity='2' distance='10'></a-light>
      <a-sky color="#3366FF"></a-sky>

      <a-entity position="1 0 3">
         <a-entity camera look-controls-enabled='false' mouse-cursor wasd-controls></a-entity>
       </a-entity>



      <a-entity position='0 0 0'>
        <a-entity position='-0.5 1.8 0' scale='2 2 2'>
          <sequencer movable v-presets midi-output-channel='1'></sequencer>
        </a-entity>
        <a-entity position='-2 -0.5 0'>
          <polysynth midi-input-channel-selector="channel: 1;"  audio-output-channel-selector="channel: filter;"></polysynth>
          <!-- <duosynth midi-input-channel-selector="channel: 1;"  audio-output-channel-selector="channel: filter;"></duosynth>  -->
          <!-- <fmsynth midi-input-channel-selector="channel: 1;"  audio-output-channel-selector="channel: filter;"></fmsynth> -->
          <!-- <synth midi-input-channel-selector="channel: 1;"  audio-output-channel-selector="channel: filter;"></synth> -->
        </a-entity>
      </a-entity>
      <a-entity position='-0.5 -0.5 0'>
        <lfo lfo-output-selector></lfo>
      </a-entity>
      <a-entity position='1 -0.5 0'>
        <filterf inputChannelName='filter' audio-output-channel-selector="channel: analyser;"></filterf>
      </a-entity>
      <a-entity position='2.5 -0.3 0'>
        <analyser analyser-display analyser-type='waveform' inputChannelName='analyser' audio-output-channel-selector="channel: analyser-fft;"></analyser>
      </a-entity>
      <a-entity position='2.5 -1.5 0'>
        <analyser analyser-display analyser-type='fft' inputChannelName='analyser-fft' audio-output-channel-selector="channel: 0;"></analyser>
      </a-entity>
      <a-entity position='5 0 0'>
        <mixer movable name='primary'></mixer>
      </a-entity>

      <!-- <a-entity position='1.1 0 0'>
        <distortion inputChannelName='distortion' audio-output-channel-selector="channel: 1;"></distortion>
      </a-entity>
      <a-entity position='2.2 0 0'>
        <freeverb inputChannelName='freeverb' audio-output-channel-selector="channel: 2;"></freeverb>
      </a-entity> -->

      <!-- <a-entity position='-4.1 0 0'>
        <mixer v-for="(mixer,index) in mixers" v-bind:mixer="mixer" v-bind:index="index"></mixer>
      </a-entity> -->
    </a-scene>
  </div>
</template>

<script>
import { EventBus } from './event-bus.js'
import sequencer from './components/Sequencer.vue'
import PolySequencer from './components/PolySequencer.vue'
import synth from './components/Synth.vue'
import FMSynth from './components/FMSynth.vue'
import Sampler from './components/Sampler.vue'
import Mixer from './components/Mixer.vue'
import Chorus from './components/Chorus.vue'
import Distortion from './components/Distortion.vue'
import Freeverb from './components/Freeverb.vue'
import Filter from './components/Filter.vue'
import PolySynth from './components/PolySynth.vue'
import Lfo from './components/LFO.vue'
import Analyser from './components/Analyser.vue'
import DuoSynth from './components/DuoSynth.vue'

require('./lib/slider-component.js')
require('./lib/button-component.js')
require('./lib/level-indicator-component.js')
require('./lib/audio-output-channel-selector.js')
require('./lib/midi-input-channel-selector.js')
require('./lib/lfo-output-selector.js')
require('./lib/analyser-display-component.js')
require('./lib/vue-preset-directive.js')
require('./lib/movable-component.js')

console.warn = function(){}

export default {
  name: 'app',
  components: {
    'sequencer': sequencer,
    'synth': synth,
    'fmsynth': FMSynth,
    'sampler': Sampler,
    'mixer': Mixer,
    'chorus': Chorus,
    'distortion': Distortion,
    'freeverb': Freeverb,
    'filterf': Filter,
    'polysequencer': PolySequencer,
    'polysynth': PolySynth,
    'lfo': Lfo,
    'analyser': Analyser,
    'duosynth': DuoSynth
  },
  data () {
    return {
      started: true,
      audio_channels: [],
      synths: [],
      lfos: [],
      lfo_inputs: [],
      midi_channels: [],
      mixers: []
    }
  },
  beforeCreate () {
    var self = this
    EventBus.$on('new-audio-channel', function (event) {
      console.log('new audio channels')
      self.audio_channels.push(event)
      console.log(event.channel_name)
    })
    EventBus.$on('new-synth', function (event) {
      console.log('new synth channels')
      self.synths.push(event)
      console.log(event.name)
    })
    EventBus.$on('new-lfo', function (event) {
      console.log('new lfo')
      self.lfos.push(event)
      console.log(event.name)
    })
    EventBus.$on('new-lfo-input', function (event) {
      console.log('new lfo input')
      self.lfo_inputs.push(event)
      console.log(event.name)
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
    this.mixers.push({
      name: 'foo'
    })
    window.channels = self.audio_channels
    window.synth_registry = self.synths
    window.lfo_registry = self.lfos
    window.lfo_inputs = self.lfo_inputs
    setTimeout(function() {
      Tone.Transport.start()
    }, 300)
  },
  methods : {
    indicate_change: function (evt) {
      console.log('changed!', evt.detail)
    },
    elementDrag: function (event) {
      console.log('element drag', event)
    }
  }
}
</script>

<style>
</style>
