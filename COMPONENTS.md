# how to design a component

* [x] required and optional attributes being set for different types
  * sequencer - `midi-output-channel`
  * effect - `audio-input-channel-selector` `audio-output-channel-selector`
  * instrument - `audio-output-channel-selector` `midi-input-channel-selector`
  * LFO - `LFO-output-selector`

* [ ] add sliders with scales and intial values
* [ ] add buttons toggle/momentary
* [ ] `setSlider` and the vue instance data with nested fields - `synth.oscillator.detune` `synth.voice0.oscillator.detune`
* [ ] assign the `synth` object to the `object3D.userData.synth` field
* [ ] `loadPresets` vue instance methods
* [ ] emitting events to the global registry, synth, audio output

```html
<!-- app -->
<foo movable
  name='foo left'
  v-presets
  midi-input-channel-selector="channel: 1;"
  audio-output-channel-selector="channel: filter;"
  audio-input-channel-selector="channel: foo_left"
  optional analyser-display analyser-type="waveform|fft" lfo-output-selector >
</foo>
```

```html
<template>
  <a-entity id='foo'>
    <!-- background box -->
    <a-box width='1' height='1' depth='0.1' color='#303' position='0.5 -0.5 0'></a-box>
    <!-- name of object -->
    <a-text value='FOO' position='0.5 -0.85 0.1' rotation='0 0 0' align='center'></a-text>
    <a-entity>
      <!-- value slider -->
      <a-entity  position='0.35 0.5 0.1' v-on:changed="slideSet('Q', $event)" :slider="['initialValue: ', scales['value'].invert(value), ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='value' rotation='0 0 90' align='center'></a-text>
      </a-entity>
      <!-- type slider with indicator of value -->
      <a-entity  position='0.55 0.5 0.1' v-on:changed="slideSet('type', $event)" :slider="['initialValue: ', scales['type'].invertExtent(type)[0], ';'].join('')" scale='0.5 0.5 0.5'>
        <a-text position='-0.12 0 0' value='type' rotation='0 0 90' align='center'></a-text>
        <a-text position='0.12 0 0' :value="type" rotation='0 0 90' align='center'></a-text>
      </a-entity>
    </a-entity>      
  </a-entity>
</template>

<script>
var d3 = require('d3')
import { EventBus } from '../event-bus.js'
export default {
  name: 'foo',
  data () {
    return {
      registryType: 'foo',
      value: 32,
      type: 'baz',
      scales: {},
      _valueNotTrackedInPreset: 1024
    }
  },
  created () {
    this.scales['value'] = d3.scaleLinear().domain([0.0, 1.0]).range([1.0, 512.0])            // real value scale
    this.scales['type'] = d3.scaleQuantile().domain([0.0, 1.0]).range(['baz', 'cat', 'dog'])  // category scale
  },
  mounted () {
    console.log('foo mounted')
    var self = this
    var synth = new Tone.Foo(this.value, this.type) // setup with initial values
    synth.name = self.$el.getAttribute('name')
    self.$nextTick(function () {  // the ThreeJS object isn't there until the next tick so put off assigning anything to the userData
      self.$el.object3D.userData.synth = synth
      EventBus.$emit('new-synth', synth)          // add me to the list of things
      EventBus.$emit('new-audio-channel', synth)  // add me to the list of audio inputs things with audio outputs can connect to      
      EventBus.$emit('new-lfo-input', { synth: synth, field: 'frequency' }) // add 'frequency' and my synth object to the list of available LFO targets
    })
  },
  methods: {
    loadPreset: function (o) {
      console.log('load preset called in foo', o)
      this.value = o.value
      this.type = o.type
    }
  }
}
</script>
```
