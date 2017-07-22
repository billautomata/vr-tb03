<template>
  <a-entity id='scalesequencer'>
    <a-entity position='1 -0.375 0'>
      <a-entity geometry='primitive: box; width: 3.0; height: 1.0; depth: 0.1;' material="color: #DAF;" position='0.5 0 -0.05'></a-entity>
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
          <a-sphere :id='"indicator-light-"+index' class='indicator-lights' position='0 -0.33 0' scale='0.05 0.05 0.05' color="#F00" radius='0.5'></a-sphere>
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
      <a-entity position='0.9 0.0 0.05' :butan="'initialValue: '+randomMode+'; buttonType: toggle;'" v-on:changed="randomMode = !randomMode"></a-entity>

      <!-- offset tunes -->
      <a-entity v-for="(tune, index) in offsetTunes">
        <a-entity :position='[(index*0.1) + 1.1, 0, 0].join(" ")'>
          <a-entity position='0 0.01 0' rotation='0 0 0' scale='1 1 1'>
            <a-entity rotation='0 0 0' scale='0.35 0.35 0.35' :slider="'initialValue: '+scales['tuneOffsetCents'].invert(tune.v)+';'" v-on:changed="setTuneSlider(index, $event)"></a-entity>
            <a-box color='#000' position='0 0.25 0' scale='0.08 0.08 0.008'></a-box>
            <a-text :value='Math.floor(tune.v)' rotation='0 0 0' color='#FFF' position='0 0.25 0.01' scale='0.2 0.2 0.2' align='center'></a-text>
          </a-entity>
        </a-entity>
      </a-entity>


    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')
import { EventBus } from '../event-bus.js';

var transposeScale = d3.scaleQuantile().domain([ 0.0, 1.0 ]).range(d3.range(-12, 13))

export default {
  name: 'scalesequencer',
  props: [ '_preset', 'index', '_p' ],
  data () {
    return {
      registryType: 'scalesequencer',
      n_steps: 16,
      n_intervals: 7,
      currentMode: 'ionian',
      steps: [],
      offsetTunes: [],
      transpose: 0,
      randomMode: false,
      scales: {
        note: d3.scaleLinear().domain([ 0.0, 1.0 ]).range([ 0, 7 ]),
        transpose: d3.scaleQuantile().domain([ 0.0, 1.0 ]).range(d3.range(-12, 13)),
      },
      _output_channel: 1
    }
  },
  created () {
    var self = this
    for(var i = 0; i < self.n_steps; i++){
      self.steps.push({
        note: 0,
        rest: true,
        octave_up: false,
        octave_down: false
      })
    }
    for(var j = 0; j < 8; j++){
      self.offsetTunes.push({
        v: 0
      })
    }
    self.scales['tuneOffsetCents'] = d3.scaleLinear().domain([0.0,1.0]).range([-200.0,200.0])

    this.randomizePattern()
  },
  updated () {
    var self = this
    EventBus.$emit('element-updated', {
      type: self.$el.getAttribute('id'),
      name: self.$el.getAttribute('name'),
      preset: self.getPresetValuesFromVueInstance()
    })
  },
  methods: {
    intervalToNote: function (intervalValue) {
      var modes = {
        ionian: [0,2,4,5,7,9,11,12],
        aeolian: [0,2,3,5,7,8,10,12],
      }
      return modes[this.currentMode][intervalValue]
    },
    setNoteSlider: function (index, evt) {
      var o = evt.detail
      // console.log('set note slider', evt)
      this.steps[index].note = Math.floor(this.scales.note(o.value))
    },
    setTuneSlider: function (index, event) {
      console.log('calling set tune slider', index, this.scales['tuneOffsetCents'](event.detail.value))
      this.offsetTunes[index].v = this.scales['tuneOffsetCents'](event.detail.value)
      // console.log(this.offsetTunes[index])
    },
    setTranspose : function (evt) {
      this.transpose = transposeScale(evt.detail.value)
    },
    randomizePattern : function (evt) {
      var self = this
      console.log('randomize pattern')
      this.steps.forEach(function (step) {
        step.note = Math.floor(Math.random() * 8.0)
        step.rest = Math.random() < 0.5 ? true : false
      })
      this.offsetTunes.forEach(function(o,i){
        // o.v = 64.0
      })
    },
    loadPreset : function (o) {
      console.log('load preset called in scalesequencer', o)
      console.log('returning early')
      return
      this.n_steps = o.n_steps
      this.steps.forEach(function (s,i) {
        s.note = o.steps[i].note
        s.rest = o.steps[i].rest
      })
      this.transpose = o.transpose
    },
    whatNoteAmIPlaying: function () {
      // convert the scale interval value to a midi note value for a scale starting at zero
      // add the base value of 60
      var step = this.steps[this.$el.currentStep]
      // console.log('step', this.steps[this.$el.currentStep], this.$el.currentStep)
      var midiNote = 60 + this.intervalToNote(step.note)
      // console.log('midi note', midiNote)
      // add 12 or -12 based on octave up or down
      if(step.octave_up === true){
        midiNote += 12
      } else if (step.octave_down === true){
        midiNote -= 12
      }
      // add the global transpose
      midiNote += this.transpose
      // convert to frequency
      var freq = Tone.Frequency(midiNote, 'midi').toFrequency()
      // add the interval tune value
      freq += this.offsetTunes[step.note].v
      // console.log('step', this.steps[this.$el.currentStep], this.$el.currentStep, freq, step.note, this.offsetTunes[step.note].v)
      // return the interval tune value as a frequency
      return freq
    }
  },
  beforeMount () {
  },
  mounted () {
    console.log('sequencer mounted')
    var self = this
    window.k = this

    self.$el.currentStep = 0

    self.$el.addEventListener('load-preset', self.loadPreset)
    self.$el._p = this._p

    Object.freeze(this._p)
    // self._output_channel = self.$el.getAttribute('midi-output-channel')
    self._output_channel = 1

    if(self._preset !== undefined){
      // how do I load the preset values from the prop if there is no slider doing the automatic update?
      console.log('there is a prop, running load preset with the prop information')
      console.log(self)
      self.loadPreset(self, self._preset)
    }

    self.$nextTick(function () {

      self.$el.indicatorLights = self.$el.querySelectorAll('a-sphere.indicator-lights')
      // setup the tick of the sequencer
      Tone.Transport.scheduleRepeat(function(time){
        // emit the current steps note value to the midi bus
        // console.log('current step', self.$el.currentStep)
        if(self.steps[self.$el.currentStep].rest === false){
          EventBus.$emit(['channel-',self._output_channel].join(''), { type: 'frequency', note: self.whatNoteAmIPlaying(), time: time })
        }
        // decide what to do next
        if(self.randomMode === true){
          self.$el.currentStep = Math.floor(Math.random()*self.n_steps)
        } else {
          self.$el.currentStep += 1
          self.$el.currentStep = self.$el.currentStep % self.n_steps
        }
        // try to set the indicator lights
        try{
          self.$el.indicatorLights.forEach(function(z){
              z.setAttribute('color', '#F0F')
          })
          self.$el.indicatorLights[self.$el.currentStep].setAttribute('color', '#0F0')
        } catch(e) {}
      }, "16n");
    })
  }
}
</script>
