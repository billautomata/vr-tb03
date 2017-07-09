<template>
  <a-entity id='mixer'>
    <a-box depth='0.1' width='2' height='2' color="#cad"></a-box>
    <a-text value='MIXER' position='0 -0.75 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity class='channel0' id='0' v-on:changed="setLevel" slider='initialValue: 0.01;' position='-0.75 0 0.1'></a-entity>
    <a-entity class='channel1' id='1' v-on:changed="setLevel" slider='initialValue: 0.01;' position='-0.25 0 0.1'></a-entity>
    <a-entity class='channel2' id='2' v-on:changed="setLevel" slider='initialValue: 0.01;' position='0.25 0 0.1'></a-entity>
    <a-entity class='channel3' id='3' v-on:changed="setLevel" slider='initialValue: 0.01;' position='0.75 0 0.1'></a-entity>
  </a-entity>
</template>

<script>
export default {
  name: 'mixer',
  data () {
    return {
      eqs: [],
      meters: []
    }
  },
  mounted () {
    var self = this
    window.smixer = self
    this.eqs.push(new Tone.EQ3().receive('channel_0').toMaster())
    this.eqs.push(new Tone.EQ3().receive('channel_1').toMaster())
    this.eqs.push(new Tone.EQ3().receive('channel_2').toMaster())
    this.eqs.push(new Tone.EQ3().receive('channel_3').toMaster())
    this.meters.push(new Tone.Meter('level'))
    this.meters.push(new Tone.Meter('level'))
    this.meters.push(new Tone.Meter('level'))
    this.meters.push(new Tone.Meter('level'))
    this.eqs.forEach(function(eq,idx){
      eq.connect(self.meters[idx])
    })
    this.meters.forEach(function(meter,idx){
      var box_meter = document.createElement('a-box')
      box_meter.setAttribute('position', '0 0.6 0')
      box_meter.setAttribute('scale', '1 1 1')
      box_meter.setAttribute('width', 0.1)
      box_meter.setAttribute('depth', 0.1)
      box_meter.setAttribute('height', 1)
      box_meter.setAttribute('color', 'red')
      box_meter.setAttribute('level-indicator', true)
      box_meter.object3D.userData.indicator = meter
      self.$el.querySelector('a-entity.channel'+idx).appendChild(box_meter)
    })
  },
  methods: {
    setLevel: function (event) {
      this.eqs[Number(event.srcElement.id)].output.gain.set('value', event.detail.value)
    }
  }
}
</script>
