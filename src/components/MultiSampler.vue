<template>
  <a-entity id='multisampler'>
    <a-box width='3' height='2.4' depth='0.1' color='#303' position='1.5 -1 0'></a-box>
    <a-text value='MultiSampler' position='0.05 0.05 0.1' rotation='0 0 0' align='left'></a-text>
    <a-entity v-for="(sampler, index) in samplers" :sampler="sampler" :index="index">
      <a-entity :position="[0.3, (-index*0.25)-0.2, 0].join(' ')">
        <a-box color='blue' depth='0.2' width='0.5' height='0.2'>
          <a-text :value="sampler.sampleName" position='0 0 0.1' color='white' align='center' scale='0.6 0.6 0.6'></a-text>
        </a-box>
        <a-entity position='0.6 0 0'>
          <a-entity v-for="(step, index) in sampler.steps" :step="step" :index="index">
            <a-box :position="[(index*0.21)-0.2, 0, 0].join(' ')" depth='0.1' width='0.2' height='0.2' :color="step.rest ? 'red' : 'orange'"></a-box>
          </a-entity>
        </a-entity>
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
import {EventBus} from '../event-bus.js'
var sampleNames = ['./audio/Clap.wav', './audio/Kick.wav']
export default {
  name: 'multisampler',
  props: [ '_preset', 'index', '_p' ],
  data () {
    return {
      registryType: 'multisampler',
      samplers: [],
      n_samplers: sampleNames.length
    }
  },
  created () {
    var self = this
    sampleNames.forEach(function(k){
      self.samplers.push(self.createSampler(k))
    })
  },
  mounted () {
    console.log('multi sampler mounted')
    var self = this
    self.synths = []
    self.$el.currentStep = 0
    self.samplers.forEach(function(s){
      self.synths.push(new Tone.Sampler(s.sampleFileName))
    })
    self.synths.forEach(function(s) { s.toMaster() })
    self.$el._p = this._p
    self.$nextTick(function () {

      // self.$el.indicatorLights = self.$el.querySelectorAll('a-sphere.indicator-lights')
      // setup the tick of the sequencer
      Tone.Transport.scheduleRepeat(function(time){
        console.log(self.$el.currentStep)
        self.samplers.forEach(function(sampler, _i){
          // console.log(sampler, self.$el.currentStep)
          // return
          if(sampler.steps[self.$el.currentStep].rest === false){
            // console.log('ok', self._output_channel)
            self.synths[_i].triggerAttackRelease(0, "8n")
            // EventBus.$emit(['channel-',self._output_channel].join(''), { type: 'midi', note: self.steps[self.$el.currentStep].note + self.transpose, time: time })
          }
        })
        if(self.randomMode === true){
          self.$el.currentStep = Math.floor(Math.random()*self.n_steps)
        } else {
          self.$el.currentStep += 1
          self.$el.currentStep = self.$el.currentStep % 16
        }

      }, "16n");
    })

  },
  methods: {
    createSampler: function (k) {
      var s = {
        sampleName: k.split('/').pop().split('.')[0],
        sampleFileName: k,
        steps: []
      }
      for(var i = 0; i < 16; i++){
        s.steps.push({
          rest: Math.random() < 0.5 ? true : false,
          accent: true
        })
      }
      return s
    }
  }
}
</script>
