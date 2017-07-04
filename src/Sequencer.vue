<template>
  <a-entity id='Sequencer'>
    <a-entity v-for="(step, index) in steps">
      <a-entity :position='[index*1.1, 0, 0].join(" ")'>
        <a-box :id='indicator-note' height='0.5' width='1' depth='0.33' :position='[0, 1 + scale(step.note), 0].join(" ")' color='#00F'></a-box>
        <a-box :height='10' width='0.1' depth='0.1' position='0 5.1 0' color='#ccc'></a-box>
        <a-sphere :id='indicator-light' position='0 0 0' :color='step.active ? "#0F0" : "#F00"' radius='0.5'></a-sphere>
        <a-box :id='rest-light' position='0 -0.8 0' height='0.33' :color='step.rest ? "#40F" : "#0FF"'></a-box>
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
    console.log('updated')
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
