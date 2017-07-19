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
              v-presets movable graphical-audio-output-config graphical-audio-input-config>
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
        <template v-for="(lfo,index) in lfos" v-bind:lfo="lfo" v-bind:index="index" >
          <a-entity :position="[lfo.p.x, lfo.p.y, lfo.p.z].join(' ')">
            <lfo :name="index" :_preset="lfo"
              v-presets movable lfo-output-selector>
            </lfo>
          </a-entity>
        </template>
        <template v-for="(duosynth,index) in duosynths" v-bind:duosynth="duosynth" v-bind:index="index" >
          <a-entity :position="[duosynth.p.x, duosynth.p.y, duosynth.p.z].join(' ')">
            <duosynth :name="index" :_preset="duosynth"
              v-presets movable graphical-audio-output-config midi-input-channel-selector>
            </duosynth>
          </a-entity>
        </template>
        <template v-for="(sequencer,index) in sequencers" v-bind:sequencer="sequencer" v-bind:index="index" >
          <a-entity :position="[sequencer.p.x, sequencer.p.y, sequencer.p.z].join(' ')">
            <sequencer :name="index" :_preset="sequencer"
              v-presets movable>
            </sequencer>
          </a-entity>
        </template>
      </a-entity>
    </a-scene>
  </div>
</template>

<script>
import { EventBus } from './event-bus.js'
import Filter from './components/Filter.vue'
import Analyser from './components/Analyser.vue'
import EQ3 from './components/EQ3.vue'
import Gain from './components/Gain.vue'
import Volume from './components/Volume.vue'
import LFO from './components/LFO.vue'
import DuoSynth from './components/DuoSynth.vue'
import Sequencer from './components/Sequencer.vue'

require('./lib/vue-preset-directive.js')

require('./lib/slider-component.js')
require('./lib/button-component.js')
require('./lib/level-indicator-component.js')
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
    'analyser': Analyser,
    'eq3': EQ3,
    'gain': Gain,
    'volume': Volume,
    'lfo': LFO,
    'duosynth': DuoSynth,
    'sequencer': Sequencer
  },
  data () {
    return {
      started: true,
      audio_channels: [],
      synths: [],
      lfos: [],
      lfo_inputs: [],
      midi_channels: [],
      duosynths: [],
      filters: [],
      analysers: [],
      eq3s: [],
      gains: [],
      volumes: [],
      sequencers: []
    }
  },
  beforeCreate () {
    var self = this
    EventBus.$on('element-updated', function (event) {
      console.log('element updated!', event)
      if(window.localStorage.getItem('master') !== null){
        window.socket.emit('update', event)
      }      
    })

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
      // self.lfos.push(event)
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

    window.socket = io.connect(window.location.href)
    socket.on('echo', function (data) {
      // console.log(data)
      // setTimeout(function () {
      //   socket.emit('echo', { v: Date.now() })
      // },1000)
    })
    socket.on('update-element', function (data) {
      if(socket.id === data.from){
        return
      } else {
        console.log('got update element to update my settings', data)
        console.log(window[data.type+'s'][Number(data.name)])

        document.querySelectorAll('a-entity#'+data.type).forEach(function(element){
          if(Number(element.getAttribute('name')) !== Number(data.name)) {
            return
          }
          console.log('found!', element)
          element.__vue__.loadPreset(element.__vue__, data.preset)
        })
      }
    })

    var self = this
    window.ok = this
    window.channels = self.audio_channels
    window.synth_registry = self.synths
    window.lfo_registry = self.lfos
    window.lfo_inputs = self.lfo_inputs

    window.duosynths = self.duosynths
    window.filters = self.filters
    window.analysers = self.analysers
    window.eq3s = self.eq3s
    window.gains = self.gains
    window.volumes = self.volumes
    window.lfos = self.lfos
    window.sequencers = self.sequencers

    Tone.Transport.start()

    var scene
    if(window.localStorage.getItem('scene') === null){
      require('./test.js')(self)
    } else {
      // loadScene()
    }

    function loadScene () {
      scene = JSON.parse(window.localStorage.getItem('scene'))
      scene.forEach(function(element){
        console.log(element.t, element.position)
        var o = element.presets
        o.p = element.position
        self[element.t+'s'].push(o)
      })
      setTimeout(function () {
        self.restoreSavedConnections()
      }, 1000)
    }

    window.loadScene = loadScene
    window.sceneRecorder = require('./lib/scene-recorder.js')

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
