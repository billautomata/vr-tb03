# synths

# rules
* if an instance doesn't have a registry type it won't save the preset but it will add the load preset function to the vue instance
* required attributes:
  * `movable`
  * `v-presets`
  * `name` (the index of the object)
* options attributes:
  * `graphical-audio-input-config`
  * `graphical-audio-output-config`

## refactor to use presets and vue lists
* [x] Filter
* [x] Analyser
* [x] EQ3 with Volume
* [x] Gain
* [x] Master Outputs
* [x] LFO
* [x] DuoSynth
  * [ ] handle midi input channel
* [x] Sequencer

## new types of registries and synths
* [ ] sequencer pattern store
* [ ] drum machine / sampler
* [x] custom synth design pattern example
* [ ] custom sequencer where you can tune scales to different interval distance for each of the 12 tones
  * [ ] Tone.Frequency(60, 'midi').toFrequency() + offset[60 % 12]


# registry cache
* [x] record scene by grabbing the preset and position of the elements
* [x] store scene in cache
* [x] load scene from cache if found
* [ ] Spawn Block
* [x] save scene node
* [x] load scene node
* [ ] remove element aframe component

## `graphical-audio-input-config`
* [x] create graphics for the input channels on the side of the object
* [ ] multiple input channels?

## `graphical-audio-output-config`
* [x] when clicked creates a connection box
* [x] when the connection box dragmove ends find the closest entry and connect the synth
* [x] then emit the details about the connection to parent app which will record them in the cache
  * [x] re-create the connections on load
* [x] draw a line from the source to the connected, have movable know about it, append the a-lines with a class you can select, then query the list of audio connections for the names of the entities to update the targets of the lines with on drag

# disabled things to help with refactoring
* [x] the current step on the step sequencer needs to be reactivated now that the slider settings aren't transmitted in the update

# weird bugs found
* [ ] save scene needs to handle the connections
* [ ] when a primary broadcasts the configuration to secondary entities, the initialization routine transmits the knob settings, that's unnecessary, turn on the network transmission with a component
