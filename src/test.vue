<template>
  <div id="app">
    <a-scene>
      <a-assets>
      </a-assets>

      <a-light color="white" type='point' position="0 4 2" intensity='2' distance='10'></a-light>
      <a-sky color="#3366FF"></a-sky>

      <a-entity id='lines'></a-entity>

      <a-entity position="1 0 3">
         <a-entity camera look-controls-enabled='false' mouse-cursor wasd-controls></a-entity>
      </a-entity>

      <a-entity position='0 0 0'>
        <template v-for="(filter,index) in filters" v-bind:filter="filter" v-bind:index="index" >
          <a-entity :position="[filter.p.x, filter.p.y, filter.p.z].join(' ')">
            <filterf :name="index" :_preset="filter"
              v-presets movable graphical-audio-output-config>
            </filterf>
          </a-entity>
        </template>
        <template v-for="(anaylser,index) in analysers" v-bind:anaylser="anaylser" v-bind:index="index" >
          <a-entity :position="[anaylser.p.x, anaylser.p.y, anaylser.p.z].join(' ')">
            <analyser :name="index" :_preset="anaylser"
              v-presets movable graphical-audio-input-config analyser-display>
            </analyser>
          </a-entity>
        </template>
        <template v-for="(eq3,index) in eq3s" v-bind:eq3="eq3" v-bind:index="index" >
          <a-entity :position="[eq3.p.x, eq3.p.y, eq3.p.z].join(' ')">
            <eq3 :name="index" :_preset="eq3"
              v-presets movable graphical-audio-input-config graphical-audio-output-config>
            </eq3>
          </a-entity>
        </template>
        <template v-for="(gain,index) in gains" v-bind:gain="gain" v-bind:index="index" >
          <a-entity :position="[gain.p.x, gain.p.y, gain.p.z].join(' ')">
            <gain :name="index" :_preset="gain"
              v-presets movable graphical-audio-input-config graphical-audio-output-config>
            </gain>
          </a-entity>
        </template>
        <template v-for="(volume,index) in volumes" v-bind:volume="volume" v-bind:index="index" >
          <a-entity :position="[volume.p.x, volume.p.y, volume.p.z].join(' ')">
            <volume :name="index" :_preset="volume"
              v-presets movable graphical-audio-input-config>
            </volume>
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
import EQ3 from './components/EQ3.vue'
import Gain from './components/Gain.vue'
import Volume from './components/Volume.vue'

require('./lib/vue-preset-directive.js')

require('./lib/slider-component.js')
require('./lib/button-component.js')
require('./lib/level-indicator-component.js')
// require('./lib/audio-output-channel-selector.js')
// require('./lib/audio-input-channel-connector.js')
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
    'analyser': Analyser,
    'eq3': EQ3,
    'gain': Gain,
    'volume': Volume
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
      filters: [],
      analysers: [],
      eq3s: [],
      gains: [],
      volumes: []
    }
  },
  beforeCreate () {
    var self = this
    EventBus.$on('audio-connection', function (event) {
      console.log('new audio connection', event)
      var m = window.localStorage.getItem('audio-connections')
      if(m === null){
        m = []
      } else {
        m = JSON.parse(m)
      }
      m.push(event)
      window.localStorage.setItem('audio-connections', JSON.stringify(m))
    })
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
    window.analysers = self.analysers
    window.eq3s = self.eq3s
    window.gains = self.gains
    window.volumes = self.volumes

    Tone.Transport.start()
    require('./test.js')(self)
    setTimeout(function () {
      self.restoreSavedConnections()
    }, 300)
  },
  methods : {
    indicate_change: function (evt) {
      console.log('changed!', evt.detail)
    },
    elementDrag: function (event) {
      console.log('element drag', event)
    },
    restoreSavedConnections: function () {
      function __t (o) { return [ o.object3D.getWorldPosition().x, o.object3D.getWorldPosition().y, o.object3D.getWorldPosition().z ].join(' ') }
      function __t2 (o) { return [ o.object3D.getWorldPosition().x + 1, o.object3D.getWorldPosition().y - 0.5, o.object3D.getWorldPosition().z ].join(' ') }

      console.log('calling restore saved connections')
      var m = window.localStorage.getItem('audio-connections')
      if(m === null){
        return
      }
      m = JSON.parse(m)
      m.forEach(function(o){
        console.log(o)
        var id = o.to.type
        var name = o.to.name
        var outputType = o.from.type
        var outputName = o.from.name
        document.querySelectorAll('a-entity#' + id).forEach(function (o) {
          if (o.getAttribute('name') === name) {
            console.log(o.synth)
            document.querySelectorAll('a-entity#' + outputType).forEach(function (r) {
              if (r.getAttribute('name') === outputName) {
                console.log('connecting', r.synth, 'to', o.synth)
                console.log('zoom', r.object3D)
                r.synth.connect(o.synth)
                var line_id = 'line__' + [id,name,outputType,outputName].join('_')
                var positionString = ['start:', __t(r), '; end:', __t2(o), '; color: white'].join(' ')
                console.log('zoom', line_id, positionString)
                document.querySelector('a-entity#lines').setAttribute(line_id, positionString)
              }
            })
          }
        })
      })
    }
  }
}
</script>

<style>
</style>
