<template>
  <a-entity id='Sequencer' rotation='90 0 0'>
    <a-entity geometry='primitive: box; width: 1.6; height: 0.1; depth: 0.6;' material="color: #00F;" position='0.75 -0.07 -0.13'></a-entity>
    <a-entity v-for="(step, index) in steps">
      <a-entity :position='[index*0.1  , 0, 0].join(" ")'>
        <a-entity scale='0.5 0.1 0.5'>
          <a-entity :ui-toggle="'value: '+(step.rest === true ? 0 : 1)+';'" v-on:change="step.rest = !step.rest" :id="'toggle' + index"></a-entity>
        </a-entity>
        <a-entity position='0 0 -0.2' rotation='0 0 0' scale='0.5 0.5 0.5'>
          <a-entity rotation='90 180 0' scale='0.5 0.5 0.5' :slider="'initialValue: '+scale.invert(step.note)+';'" v-on:changed="setNoteSlider(index, $event)"></a-entity>
          <a-box color='#AAA' position='0 -0.01 -0.4' scale='0.13 0.01 0.13'></a-box>
          <a-text :value='step.note' rotation='-90 0 0' color='#F0F' position='0 0.01 -0.4' scale='0.4 0.4 0.4' align='center'></a-text>
        </a-entity>
        <a-sphere :id='indicator-light' position='0 -0.02 0.12' scale='0.05 0.05 0.05' :color='step.active ? "#0F0" : "#F00"' radius='0.5'></a-sphere>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import { EventBus } from './event-bus.js';

export default {
  name: 'Sequencer',
  data () {
    return {
      current_step: 0,
      n_steps: 16,
      steps: [],
      scale: d3.scaleLinear().domain([ 0.0, 1.0 ]).range([ 34, 60 ]),
      output_channel: 1
    }
  },
  updated () {
    // console.log('updated 2')
  },
  methods: {
    setNoteSlider: function (index, evt) {
      var o = evt.detail
      console.log('set note slider', evt)
      this.steps[index].note = Math.floor(this.scale(o.value))
    }
  },
  mounted () {
    console.log('sequencer mounted')
    var self = this

    window.r = self.scale
    for(var i = 0; i < self.n_steps; i++){
      self.steps.push({
        note: Math.floor(Math.random() * 20.0) + 35.0,
        velocity: 0,
        slide: 0,
        accent: 0,
        active: false,
        rest: Math.random() < 0.5 ? true : false
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
        EventBus.$emit(['channel-',self.output_channel].join(''), { note: self.steps[self.current_step].note, time: time })
      }
    }, "16n");
    console.log('Sequencer Mounted')
  }
}
</script>
