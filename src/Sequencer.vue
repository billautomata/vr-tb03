<template>
  <a-entity id='Sequencer' rotation='90 0 0'>
    <a-entity v-for="(step, index) in steps">
      <a-entity :position='[index*0.1  , 0, 0].join(" ")'>
        <a-entity scale='0.5 0.1 0.5'>
          <a-entity :ui-toggle="'value: '+(step.rest === true ? 0 : 1)+';'" v-on:change="step.rest = !step.rest" :id="'toggle' + index"></a-entity>
        </a-entity>
        <a-entity position='0 0 -0.2' scale='0.5 0.5 0.5'>
          <a-sphere :id="'note-slider_'+index" click-drag lock-position v-on:click="clicked"
            :position="['0', '0', scale(step.note)].join(' ')"
            v-on:foo="food"
          radius="0.05" color="#EF2D5E"></a-sphere>
        </a-entity>
        <a-sphere :id='indicator-light' position='0 0 0.1' scale='0.05 0.05 0.05' :color='step.active ? "#0F0" : "#F00"' radius='0.5'></a-sphere>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import { EventBus } from './event-bus.js';

window.AFRAME.registerComponent('lock-position', {
  init: function () {
    var self = this
    console.log('loaded lock-position')
    console.log(self.el.id)
    self.el.object3D.userData.dimension = 'z'
    self.el.object3D.userData.z_min = -0.3
    self.el.object3D.userData.z_max = 0.2
    self.el.object3D.userData.step_index = Number(self.el.id.split('_')[1])
    console.log(self.el.object3D.userData.step_index)
    self.el.object3D.userData.zpos = self.el.object3D.position.z
    // self.el.object3D.userData.dim_value = self.el.object3D.children
    return
  },
  tick: function () {
    var self = this
    window.z = self.el
    self.el.object3D.position.x = 0
    self.el.object3D.position.y = 0

    // console.log(self.scale.invert(self.el.object3D.position.z))
    if(self.el.object3D.userData.zpos != self.el.object3D.position.z){
      window.update_note(self.el.object3D)
      self.el.emit('foo')
      self.el.object3D.userData.zpos = self.el.object3D.position.z
    }

    // clamp the z
    self.el.object3D.position.z = Math.max(self.el.object3D.position.z, -0.3)
    self.el.object3D.position.z = Math.min(self.el.object3D.position.z, 0.2)
    return
  },
  update: function (old) {
    console.log(old)
  }
})


export default {
  name: 'Sequencer',
  data () {
    return {
      current_step: 0,
      n_steps: 16,
      steps: [],
      scale: d3.scaleLinear().domain([ 20, 64 ]).range([ 0.2, -0.3 ])
    }
  },
  updated () {
    // console.log('updated 2')
  },
  methods: {
    change: function (evt) {
      console.log('hover!')
      console.log(this)

      // console.log(this.el.components.seq_id)
    },
    clicked: function () {
      console.log('clicked')
    },
    increaseNote: function (evt) {
      console.log('increase')
      console.log(evt)
      this.steps[evt.srcElement.id.split('_')[1]].note += 10
      this.$el.querySelector('#note-slider_'+evt.srcElement.id.split('_')[1]).components["ui-slider"].attrValue.value = this.steps[evt.srcElement.id.split('_')[1]].note
    },
    food: function () {
      // console.log('food')
    }
  },
  mounted () {
    console.log('sequencer mounted')
    var self = this

    window.update_note = function (object3D) {
      // console.log(self.steps)
      self.steps[object3D.userData.step_index].note = Math.floor(self.scale.invert(object3D.position.z))
    }

    window.r = self.scale
    for(var i = 0; i < self.n_steps; i++){
      self.steps.push({
        note: Math.floor(Math.random() * 44.0) + 20.0,
        velocity: 0,
        slide: 0,
        accent: 0,
        active: false,
        rest: Math.random() < 0.25 ? true : false
      })
    }
    Tone.Transport.scheduleRepeat(function(time){
    	// do something with the time
      // console.log(time, 'ok')
      self.current_step += 1
      self.current_step = self.current_step % self.n_steps
      self.steps.forEach(function(s,i){
        if(self.current_step === i){
          s.active = true
        } else {
          s.active = false
        }
      })
      //play a middle 'C' for the duration of an 8th note
      if(self.steps[self.current_step].rest === false){
        EventBus.$emit('play-note', { note: self.steps[self.current_step].note, time: time })
      }
    }, "16n");
    console.log('Sequencer Mounted')
  }
}
</script>
