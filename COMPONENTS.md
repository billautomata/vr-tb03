# how to design a component

* required attributes being set for different types
* sequencer - `midi-output-channel`
* effect - `inputChannelName` `audio-output-channel-selector`
* instrument - `audio-output-channel-selector` `midi-input-channel-selector`
* LFO - `LFO-output-selector`

* [ ] add sliders with scales and intial values
* [ ] add buttons toggle/momentary
* [ ] `setSlider` and the vue instance data with nested fields - `synth.oscillator.detune` `synth.voice0.oscillator.detune`
* [ ] assign the `synth` object to the `object3D.userData.synth` field
* [ ] `loadPresets` vue instance methods
* [ ] emitting events to the global registry, synth, audio output
