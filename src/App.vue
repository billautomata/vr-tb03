<template>
  <div id="app">
    <a-scene physics="debug: true;" shadows>
      <a-assets>
      </a-assets>
      <a-entity position="1 0 2">
         <a-entity camera look-controls-enabled='false' look-controls mouse-cursor wasd-controls></a-entity>
         <!-- <a-entity camera wasd-controls mouse-cursor></a-entity> -->
       </a-entity>
      <!-- <a-entity laser-controls="hand: left"></a-entity> -->

      <a-entity rotation='90 0 0'>
        <sequencer channel='1'></sequencer>
      </a-entity>

      <a-entity position='0 -0.3 0'>
        <synth channel='1'></synth>
      </a-entity>

      <a-entity position='3 0 0'>
        <a-entity rotation='90 0 0'>
          <sequencer channel='2'></sequencer>
        </a-entity>

        <a-entity position='0 -0.3 0'>
          <synth channel='2'></synth>
        </a-entity>
      </a-entity>


      <!-- <a-entity position='0 0 0' butan='initialValue: 1;'></a-entity> -->


    </a-scene>
  </div>
</template>

<script>
import sequencer from './Sequencer.vue'
import synth from './synth.vue'
import FMsynth from './FM-synth.vue'
console.warn = function(){}

require('./slider-handle.js')
require('./slider-component.js')
require('./toggle-button-component.js')

export default {
  name: 'app',
  components: {
    'sequencer': sequencer,
    'synth': synth,
    'fm-synth': FMsynth
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
