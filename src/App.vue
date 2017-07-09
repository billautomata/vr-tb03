<template>
  <div id="app">
    <a-scene physics="debug: true;">
      <a-assets>
      </a-assets>
      <a-entity position="1 0 2">
         <a-entity camera look-controls-enabled='false' look-controls mouse-cursor wasd-controls></a-entity>
         <!-- <a-entity camera wasd-controls mouse-cursor></a-entity> -->
       </a-entity>
      <!-- <a-entity laser-controls="hand: left"></a-entity> -->

      <a-entity rotation='90 0 0'>
        <sequencer channel='1' ></sequencer>
      </a-entity>

      <a-entity position='0 -0.3 0'>
        <synth channel='1' audioChannel='channel_0'></synth>
      </a-entity>

      <!-- <sampler channel='2' note='34' sample='./audio/Clap 003.wav'></sampler>
      <sampler channel='2' note='35' sample='./audio/808 Bass A.WAV'></sampler> -->
      <a-entity position='3 0 0'>
        <a-entity rotation='90 0 0'>
          <sequencer channel='2'></sequencer>
        </a-entity>
        <a-entity position='0 -0.3 0'>
          <synth channel='2' audioChannel="channel_1"></synth>
        </a-entity>
      </a-entity>
      <a-light color="white" type='point' position="0 4 2" intensity='2' distance='10'></a-light>
      <a-entity position='-2 0 0'>
        <mixer></mixer>
      </a-entity>


    </a-scene>
  </div>
</template>

<script>
import sequencer from './components/Sequencer.vue'
import synth from './components/Synth.vue'
import FMsynth from './components/FM-synth.vue'
import Sampler from './components/Sampler.vue'
import Mixer from './components/Mixer.vue'

console.warn = function(){}

// require('./slider-handle.js')
require('./slider-component.js')
require('./toggle-button-component.js')
require('./level-indicator-component.js')

export default {
  name: 'app',
  components: {
    'sequencer': sequencer,
    'synth': synth,
    'fm-synth': FMsynth,
    'sampler': Sampler,
    'mixer': Mixer
  },
  data () {
    return {
      started: true
    }
  },
  beforeCreate () {
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
    //repeated event every 8th note
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
