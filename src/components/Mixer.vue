<template>
  <a-entity id='mixer'>
    <a-box depth='0.1' width='2' height='2' color="#cad"></a-box>
    <a-text value='MIXER' position='0 0.7 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity id='0' v-on:changed="setLevel" slider='initialValue: 0.5;' position='-0.75 0 0.1'></a-entity>
    <a-entity id='1' v-on:changed="setLevel" slider='initialValue: 0.2;' position='-0.25 0 0.1'></a-entity>
    <a-entity id='2' v-on:changed="setLevel" slider='initialValue: 0.3;' position='0.25 0 0.1'></a-entity>
    <a-entity id='3' v-on:changed="setLevel" slider='initialValue: 0.4;' position='0.75 0 0.1'></a-entity>
  </a-entity>
</template>

<script>
export default {
  name: 'mixer',
  data () {
    return {
      eqs: []
    }
  },
  mounted () {
    this.eqs.push(new Tone.EQ3().receive('channel_0').toMaster())
    this.eqs.push(new Tone.EQ3().receive('channel_1').toMaster())
    this.eqs.push(new Tone.EQ3().receive('channel_2').toMaster())
    this.eqs.push(new Tone.EQ3().receive('channel_3').toMaster())
  },
  methods: {
    setLevel: function (event) {
      this.eqs[Number(event.srcElement.id)].output.gain.set('value', event.detail.value)
    }
  }
}
</script>
