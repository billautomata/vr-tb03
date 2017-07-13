<template>
  <a-entity id='Sequencer' rotation='0 0 0'>
    <a-entity geometry='primitive: box; width: 2.0; height: 0.1; depth: 1;' material="color: #00F;" position='0.75 -0.07 -0.13'></a-entity>
    <!-- steps -->
    <a-entity v-for="(step, index) in steps" v-bind:step="step" v-bind:index="index">
      <a-entity :position='[index*0.1  , 0, 0].join(" ")'>
        <template v-for="(note, noteIndex) in step.notes" :note="note" :noteIndex="note_index">
          <a-entity :position="[0, 0, (noteIndex*0.1) - 0.5].join(' ')">
            <a-entity scale='0.75 0.1 0.75'>
              <a-entity
                :butan="'initialValue: '+(note.rest === true ? false : true)+'; buttonType: toggle;'"
                v-on:changed="note.rest = !note.rest">
              </a-entity>
            </a-entity>
          </a-entity>
        </template>
        <a-sphere :id='indicator-light' position='0 -0.02 0.12' scale='0.05 0.05 0.05' :color='step.active ? "#0F0" : "#F00"' radius='0.5'></a-sphere>
      </a-entity>
    </a-entity>
    <!-- transpose slider -->
    <a-entity rotation='90 180 0'>
      <a-entity position='0.15 0.12 0.02' scale='0.65 0.65 0.65'>
        <a-entity slider='initialValue: 0.5' v-on:changed='setTranspose'></a-entity>
      </a-entity>
    </a-entity>
    <!-- randomize button -->
    <a-entity position='1.65 0 0.17' butan='initialValue: true; buttonType: momentary;' v-on:changed='randomizePattern'></a-entity>
    <!-- <a-entity position='1.65 0 0.0' butan='initialValue: false; buttonType: toggle;' v-on:changed='randomizePattern'></a-entity> -->
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
      current_step: 0,
      n_steps: 16,
      n_poly: 6,
      steps: [],
      transpose: 0,
      scale: d3.scaleLinear().domain([ 0.0, 1.0 ]).range([ 34, 60 ]),
      output_channel: 1
    }
  },
  updated () {
    // console.log('updated 2')
  },
  methods: {
    // setNoteSlider: function (index, evt) {
    //   var o = evt.detail
    //   // console.log('set note slider', evt)
    //   this.steps[index].note = Math.floor(this.scale(o.value))
    // },
    setTranspose : function (evt) {
      this.transpose = transposeScale(evt.detail.value)
    },
    randomizePattern : function (evt) {
      console.log('randomize pattern')
      this.steps.forEach(function (step) {
        step.notes.forEach(function(note){
          note.note = Math.floor(Math.random() * 20.0) + 35.0
          note.rest = Math.random() < 0.5 ? true : false
        })
      })
    }
  },
  created () {
    var self = this
    for(var i = 0; i < self.n_steps; i++){
      self.steps.push({
        notes: [],
        active: false
      })
      for(var j = 0; j < self.n_poly; j++){
        self.steps[i].notes.push({
          note: Number(34+(j*2)),
          velocity: 0,
          slide: 0,
          accent: 0,
          rest: Math.random() < 0.5 ? true : false
        })
      }
    }
  },
  mounted () {
    console.log('sequencer mounted')
    var self = this

    self.output_channel = self.$el.getAttribute('channel')
    window.p = this

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
      if(self.steps[self.current_step].notes.filter(function(o){return o.rest}).length !== 0){
        var notes = []
        self.steps[self.current_step].notes.forEach(function(n){
          if(n.rest === false){
            notes.push(n.note + self.transpose)
          }
        })
        EventBus.$emit(['channel-',self.output_channel].join(''), { type: 'poly', notes: notes, time: time })
      }
    }, "16n");
    console.log('Sequencer Mounted')
  }
}
</script>
