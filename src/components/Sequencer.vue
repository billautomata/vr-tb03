<template>
  <a-entity id='Sequencer'>
    <a-entity position='1 -0.375 0'>
      <a-entity geometry='primitive: box; width: 2.0; height: 1.0; depth: 0.1;' material="color: #00F;" position='0 0 -0.05'></a-entity>
      <!-- steps -->
      <a-entity v-for="(step, index) in steps">
        <a-entity :position='[(index*0.1) - 0.75, 0, 0].join(" ")'>
          <a-entity position='0 -0.25 0' scale='0.8 0.8 0.8'>
            <a-entity :butan="'initialValue: '+(step.rest === true ? false : true)+'; buttonType: toggle;'" v-on:changed="step.rest = !step.rest"></a-entity>
          </a-entity>
          <a-entity position='0 0.01 0' rotation='0 0 0' scale='1 1 1'>
            <a-entity rotation='0 0 0' scale='0.35 0.35 0.35' :slider="'initialValue: '+scales.note.invert(step.note)+';'" v-on:changed="setNoteSlider(index, $event)"></a-entity>
            <a-box color='#000' position='0 0.25 0' scale='0.08 0.08 0.008'></a-box>
            <a-text :value='step.note' rotation='0 0 0' color='#FFF' position='0 0.25 0.01' scale='0.2 0.2 0.2' align='center'></a-text>
          </a-entity>
          <a-sphere :id='indicator-light' position='0 -0.33 0' scale='0.05 0.05 0.05' :color='step.active ? "#0F0" : "#F00"' radius='0.5'></a-sphere>
        </a-entity>
      </a-entity>
      <!-- transpose slider -->

      <a-entity position='-0.9 0 0' scale='0.65 0.65 0.65'>
        <a-entity rotation='0 180 0'>
          <a-entity slider='initialValue: 0.5' v-on:changed='setTranspose'></a-entity>
        </a-entity>
      </a-entity>

      <!-- randomize button -->
      <a-entity position='0.9 0.25 0.05' butan='initialValue: true; buttonType: momentary;' v-on:changed='randomizePattern'></a-entity>
      <!-- <a-entity position='1.65 0 0.0' butan='initialValue: false; buttonType: toggle;' v-on:changed='randomizePattern'></a-entity> -->

    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
window.d3 = d3
import { EventBus } from '../event-bus.js';

var transposeScale = d3.scaleQuantile().domain([ 0.0, 1.0 ]).range(d3.range(-12, 13))

export default {
  name: 'Sequencer',
  data () {
    return {
      registryType: 'step-sequencer',
      current_step: 0,
      n_steps: 16,
      steps: [],
      transpose: 0,
      scales: {
        note: d3.scaleLinear().domain([ 0.0, 1.0 ]).range([ 34, 60 ])
      },
      output_channel: 1
    }
  },
  created () {
    var self = this
    for(var i = 0; i < self.n_steps; i++){
      self.steps.push({
        note: 0,
        active: false,
        rest: true
      })
    }
    this.randomizePattern()
  },
  methods: {
    setNoteSlider: function (index, evt) {
      var o = evt.detail
      // console.log('set note slider', evt)
      this.steps[index].note = Math.floor(this.scales.note(o.value))
    },
    setTranspose : function (evt) {
      this.transpose = transposeScale(evt.detail.value)
    },
    randomizePattern : function (evt) {
      console.log('randomize pattern')
      this.steps.forEach(function (step) {
        step.note = Math.floor(Math.random() * 20.0) + 35.0
        step.rest = Math.random() < 0.5 ? true : false
      })
    },
    loadPreset : function (o) {
      console.log('load preset called in sequencer', o)
      this.n_steps = o.n_steps
      this.steps.forEach(function (s,i) {
        s.note = o.steps[i].note
        s.rest = o.steps[i].rest
      })
      this.transpose = o.transpose
    }
  },
  mounted () {
    console.log('sequencer mounted')
    var self = this

    self.$el.addEventListener('load-preset', self.loadPreset)
    self.output_channel = self.$el.getAttribute('channel')

    // setup the tick of the sequencer
    Tone.Transport.scheduleRepeat(function(time){
      self.current_step += 1
      self.current_step = self.current_step % self.n_steps
      self.steps.forEach(function(s,i){
        if(self.current_step === i){
          s.active = true
        } else {
          s.active = false
        }
      })
      if(self.steps[self.current_step].rest === false){
        EventBus.$emit(['channel-',self.output_channel].join(''), { type: 'mono', note: self.steps[self.current_step].note + self.transpose, time: time })
      }
    }, "16n");
  }
}
</script>
