<template>
  <div id="app">
    <a-scene physics="debug: true;" shadows>
      <a-assets>
      </a-assets>
      <a-entity position="1 0 1">
         <a-entity camera look-controls-enabled='false' mouse-cursor wasd-controls></a-entity>
         <!-- <a-entity camera wasd-controls mouse-cursor></a-entity> -->
       </a-entity>
      <!-- <a-entity laser-controls="hand: left"></a-entity> -->
      <sequencer></sequencer>
      <synth></synth>

    </a-scene>
  </div>
</template>

<script>
require('./pin-component.js')
import sequencer from './Sequencer.vue'
import synth from './synth.vue'
console.warn = function(){}

export default {
  name: 'app',
  components: {
    'sequencer': sequencer,
    'synth': synth
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
  }
}
</script>

<style>
</style>
