<template>
  <div id="app">
    <a-scene physics="debug: true;" shadows>
      <a-assets>
        <!-- <a-asset-item id='pin-obj' src='./models/pin.obj'></a-asset-item> -->
        <!-- <a-asset-item id='floor-obj' src='./models/floor.obj'></a-asset-item> -->
      </a-assets>
      <a-camera position='8 0 10' look-controls></a-camera>
      <sequencer></sequencer>
    </a-scene>
  </div>
</template>

<script>
require('./pin-component.js')
import sequencer from './Sequencer.vue'

export default {
  name: 'app',
  components: {
    'sequencer': sequencer
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
    Tone.Transport.start()
  }
}
</script>

<style>
</style>
