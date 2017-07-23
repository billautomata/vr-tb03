<template>
  <div id="app">
    <a-scene>
      <a-assets>
      </a-assets>

      <a-light color="white" type='point' position="0 4 2" intensity='2' distance='10'></a-light>
      <a-sky color="#3366FF"></a-sky>

      <a-entity position='0 0 -2'>
        <a-box color='#3F3' position='-4 0 0' spawn-block>
          <a-text value="Spawn Block" align="center" position='0 1 0'></a-text>
        </a-box>
        <a-box color='yellow' position='-1 0 0' v-on:click='saveSceneToDisk'>
          <a-text value="Save To Disk" align="center" position='0 1 0'></a-text>
        </a-box>
        <a-box color='red' position='1 0 0' v-on:click='loadScene'>
          <a-text value="Load From Disk" align="center" position='0 1 0'></a-text>
        </a-box>
        <a-box color='green' position='4 0 0' v-on:click='broadcastConfig'>
          <a-text value="Broadcast Config" align="center" position='0 1 0'></a-text>
        </a-box>
      </a-entity>

      <a-entity id='lines'></a-entity>

      <a-entity position="-4 0 2">
         <a-entity camera look-controls-enabled='false' mouse-cursor wasd-controls></a-entity>
      </a-entity>
      <a-entity v-for="(filter,index) in filters" v-bind:filter="filter" v-bind:index="index" >
        <filterf :name="index" :_preset="filter" :_p="filter.p"
          v-presets movable graphical-audio-output-config graphical-audio-input-config>
        </filterf>
      </a-entity>
      <a-entity v-for="(analyser,index) in analysers" v-bind:analyser="analyser" v-bind:index="index" >
        <analyser :name="index" :_preset="analyser" :_p="analyser.p"
          v-presets movable graphical-audio-input-config analyser-display>
        </analyser>
      </a-entity>
      <a-entity v-for="(eq3,index) in eq3s" v-bind:eq3="eq3" v-bind:index="index" >
        <eq3 :name="index" :_preset="eq3" :_p="eq3.p"
          v-presets movable graphical-audio-input-config graphical-audio-output-config>
        </eq3>
      </a-entity>
      <a-entity v-for="(gain,index) in gains" v-bind:gain="gain" v-bind:index="index" >
        <gain :name="index" :_preset="gain" :_p="gain.p"
          v-presets movable graphical-audio-input-config graphical-audio-output-config>
        </gain>
      </a-entity>
      <a-entity v-for="(volume,index) in volumes" v-bind:volume="volume" v-bind:index="index" >
        <volume :name="index" :_preset="volume" :_p="volume.p"
          v-presets movable graphical-audio-input-config>
        </volume>
      </a-entity>
      <a-entity v-for="(lfo,index) in lfos" v-bind:lfo="lfo" v-bind:index="index" >
        <lfo :name="index" :_preset="lfo" :_p="lfo.p"
          v-presets movable lfo-output-selector>
        </lfo>
      </a-entity>
      <a-entity v-for="(duosynth,index) in duosynths" v-bind:duosynth="duosynth" v-bind:index="index" >
        <duosynth :name="index" :_preset="duosynth" :_p="duosynth.p"
          v-presets movable graphical-audio-output-config midi-input-channel-selector>
        </duosynth>
      </a-entity>

      <a-entity v-for="(sequencer,index) in sequencers" v-bind:sequencer="sequencer" v-bind:index="index">
        <sequencer :name="index" :_preset="sequencer" :_p="sequencer.p"
          v-presets movable>
        </sequencer>
      </a-entity>

      <a-entity v-for="(scalesequencer,index) in scalesequencers" v-bind:scalesequencer="scalesequencer" v-bind:index="index">
        <scalesequencer :name="index" :_preset="scalesequencer" :_p="scalesequencer.p"
          v-presets movable>
        </scalesequencer>
      </a-entity>

      <a-entity v-for="(multisampler,index) in multisamplers" v-bind:multisampler="multisampler" v-bind:index="index">
        <multisampler :name="index" :_preset="multisampler" :_p="multisampler.p"
          v-presets movable>
        </multisampler>
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
import ScaleSequencer from './components/ScaleSequencer.vue'
import MultiSampler from './components/MultiSampler.vue'

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
require('./lib/spawn-block-component.js')

window.Tone.CustomSynth = require('./lib/custom-synths/custom-synth.js')(Tone)

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
    'sequencer': Sequencer,
    'scalesequencer': ScaleSequencer,
    'multisampler': MultiSampler
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
      sequencers: [],
      scalesequencers: [],
      multisamplers: []
    }
  },
  created () {
    var self = this
    EventBus.$on('spawn', function (event) {
      console.log('spawning', event.elementType)
      self[event.elementType+'s'].push(JSON.parse(JSON.stringify(event.settings)))
    })

    EventBus.$on('element-updated', function (event) {
      // from the sliders, send to the server
      self.socket.emit('update', event)
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
  mounted() {
    var self = this
    self.socket = io.connect(window.location.href)
    self.socket.network_timeout = {}
    // self.socket.on('echo', function (data) {
      // console.log(data)
      // setTimeout(function () {
      //   socket.emit('echo', { v: Date.now() })
      // },1000)
    // })
    self.socket.on('new-scene', function (data) {

      if(self.socket.id === data.from){
        return
      } else {
        console.log('got new scene event', data)
        window.localStorage.setItem('scene', data.scene)
        window.localStorage.setItem('audio-connections', data.connections)
        window.location.reload()
      }
    })
    self.socket.on('update-element', function (data) {
      // new slider data
      if(self.socket.id === data.from){
        return
      } else {
        console.log('got update element to update my settings', data)
        console.log(window[data.type+'s'][Number(data.name)])

        document.querySelectorAll('a-entity#'+data.type).forEach(function(element){
          if(Number(element.getAttribute('name')) !== Number(data.name)) {
            return
          }
          console.log('found!', element.synth, element.synth.network_on)
          console.log('turning network OFF for', element.synth)
          element.synth.network_on = false
          element.__vue__.loadPreset(element.__vue__, data.preset)
          clearTimeout(self.socket.network_timeout)
          self.socket.network_timeout = setTimeout(function (){
            console.log('turning network ON for', element.synth)
            element.synth.network_on = true
          },1000)
        })
      }
    })

    window.ok = this
    // window.channels = self.audio_channels
    // window.synth_registry = self.synths
    // window.lfo_registry = self.lfos
    // window.lfo_inputs = self.lfo_inputs
    //
    // window.duosynths = self.duosynths
    // window.filters = self.filters
    // window.analysers = self.analysers
    // window.eq3s = self.eq3s
    // window.gains = self.gains
    // window.volumes = self.volumes
    // window.lfos = self.lfos
    // window.sequencers = self.sequencers

    Tone.Transport.start()

    var scene
    if(window.localStorage.getItem('scene') === null){
      // require('./test.js')(self)
      self.multisamplers.push({
        p: { x: -4, y: 0, z: 0 }
      })
    } else {
      this.loadScene()
    }
  },
  methods : {
    broadcastConfig: function () {
      var self = this
      this.saveSceneToDisk()
      var o = {
        scene: window.localStorage.getItem('scene'),
        connections: window.localStorage.getItem('audio-connections')
      }
      if(o.connections === null){
        o.connections = []
      }
      console.log('sending this to the server', o)
      self.socket.emit('scene_to_server', o)
    },
    loadScene: function () {
      var self = this
      var scene = JSON.parse(window.localStorage.getItem('scene'))
      scene.forEach(function(element){
        console.log(element.t, element.position)
        var o = element.presets
        o.p = element.position
        self[element.t+'s'].push(o)
      })
      setTimeout(function () {
        self.restoreSavedConnections()
      }, 1000)
    },
    saveSceneToDisk: function () {
      window.localStorage.setItem('scene', require('./lib/scene-recorder.js')())
    },
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
