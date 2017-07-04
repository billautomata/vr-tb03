<template>
  <a-entity id='Sequencer' rotation='90 0 0'>
    <a-entity v-for="(step, index) in steps">
      <a-entity :position='[index*0.1  , 0, 0].join(" ")'>
        <a-entity scale='0.5 0.1 0.5'>
          <a-entity :ui-toggle="'value: '+(step.rest === true ? 0 : 1)+';'" v-on:change="step.rest = !step.rest" :id="'toggle' + index"></a-entity>
        </a-entity>
        <a-entity position='0 0 -0.2' scale='0.5 0.5 0.5'>
          <a-entity :ui-slider="'min: 20; max: 64; value: '+(step.note)+';'" rotation='0 90 0'></a-entity>
        </a-entity>
        <a-sphere :id='indicator-light' position='0 0 0.1' scale='0.05 0.05 0.05' :color='step.active ? "#0F0" : "#F00"' radius='0.5'></a-sphere>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
var d3 = require('d3')

//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

export default {
  name: 'Sequencer',
  data () {
    return {
      current_step: 0,
      n_steps: 16,
      steps: [],
      scale: d3.scaleLinear().domain([ 20, 64 ]).range([ 0, 9 ])
    }
  },
  updated () {
    console.log('updated 2')
  },
  methods: {
    change: function (evt) {
      console.log('hover!')
      console.log(this)
      console.log(evt)
      // console.log(this.el.components.seq_id)
    },
    clicked: function () {
      console.log('clicked')
    }
  },
  mounted () {
    console.log('sequencer mounted')
    var self = this
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
        synth.triggerAttackRelease(Tone.Frequency(self.steps[self.current_step].note, 'midi'), "16n", time);
      }
    }, "16n");
    console.log('Sequencer Mounted')
  }
}
</script>
