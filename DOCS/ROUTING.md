Components can advertise their inputs

```javascript
var registry = {
  audio_inputs: [
    { name: 'Filter', synth: o }
  ],
  lfo_inputs: [
    { name: 'Filter', synth: o, field: 'frequency' },
    { name: 'MonoSynth', synth: o, field: 'oscillator.detune' },
  ],
}
```

```javascript
// connector components

// connect audio
self.el.object3D.userData.synth.disconnect()
self.el.object3D.userData.synth.send(registry.audio_inputs[0].name)

// lfo connect
var input = lfo_inputs[1]
var field = input.field
if(field.indexOf('.') !== -1){
  self.el.object3D.userData.synth.connect(lfo_inputs[0].synth[field.split('.')[0]][field.split('.')][1])  
} else {
  self.el.object3D.userData.synth.connect(lfo_inputs[0].synth[field])  
}

```
