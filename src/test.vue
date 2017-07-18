<template>
  <div id="app">
    <a-scene>
      <a-assets>
      </a-assets>

      <a-light color="white" type='point' position="0 4 2" intensity='2' distance='10'></a-light>
      <a-sky color="#3366FF"></a-sky>

      <a-entity position="1 0 3">
         <a-entity camera look-controls-enabled='false' mouse-cursor wasd-controls></a-entity>
      </a-entity>

      <a-entity position='-2.5 -0.3 0'>
        <analyser name='a1' graphical-audio-input-config movable analyser-display analyser-type='waveform'></analyser>
      </a-entity>

      <a-entity position='-2.5 -1.5 0'>
        <analyser name='a2' graphical-audio-input-config movable analyser-display analyser-type='fft'></analyser>
      </a-entity>

      <a-entity position='0 0 0'>
        <template v-for="(filter,index) in filters" v-bind:filter="filter" v-bind:index="index" >
          <a-entity :position="[filter.p.x, filter.p.y, filter.p.z].join(' ')">
            <filterf :name="filter.name" v-presets movable :_synth="filter"
              graphical-audio-output-config
              :audio-input-channel-connector="'channel: ' +filter.inputChannel+';'"
              ></filterf>
          </a-entity>
        </template>
      </a-entity>

      <!-- <a-entity position='2 0 0'>
        <mixer name='primary'></mixer>
      </a-entity> -->
    </a-scene>
  </div>
</template>

<script>
import { EventBus } from './event-bus.js'
import Filter from './components/Filter.vue'
import Mixer from './components/Mixer.vue'
import Analyser from './components/Analyser.vue'

require('./lib/vue-preset-directive.js')

require('./lib/slider-component.js')
require('./lib/button-component.js')
require('./lib/level-indicator-component.js')
require('./lib/audio-output-channel-selector.js')
require('./lib/audio-input-channel-connector.js')
require('./lib/midi-input-channel-selector.js')
require('./lib/lfo-output-selector.js')
require('./lib/analyser-display-component.js')
require('./lib/vue-preset-directive.js')
require('./lib/movable-component.js')

require('./lib/graphical-audio-input-config.js')

console.warn = function(){}

export default {
  name: 'app',
  components: {
    'filterf': Filter,
    'mixer': Mixer,
    'analyser': Analyser
  },
  data () {
    return {
      started: true,
      audio_channels: [],
      synths: [],
      lfos: [],
      lfo_inputs: [],
      midi_channels: [],
      DuoSynths: [],
      mixers: [],
      filters: []
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
    window.ok = this
    window.channels = self.audio_channels
    window.synth_registry = self.synths
    window.lfo_registry = self.lfos
    window.lfo_inputs = self.lfo_inputs
    window.DuoSynths = self.DuoSynths
    window.filters = self.filters
    Tone.Transport.start()
    require('./test.js')(self)
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
