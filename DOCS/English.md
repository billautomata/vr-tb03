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



## new stuff to make
* [ ] song mode sequencer pattern store, step sequencer patterns can be loaded into song players
* [ ] drum machine / sampler
* [ ] midi input channel component
* [x] custom synth design pattern example

# scalesequencer
* [x] custom step sequencer with hardcoded scales where you can tune scales to different interval distance for each of the 12 tones
* [ ] Tone.Frequency(60, 'midi').toFrequency() + offset[60 % 12]


# weird bugs found
* [ ] save scene needs to handle the connections
* [ ] when a primary broadcasts the configuration to secondary entities, the initialization routine transmits the knob settings, that's unnecessary, control the network transmission toggle with a component on all synths

# registry cache
* [ ] Spawn Block component
* [ ] Remove Element component
* [x] record scene by grabbing the preset and position of the elements
* [x] store scene in cache
* [x] load scene from cache if found
* [x] save scene node
* [x] load scene node

# disabled things to help with refactoring

## `graphical-audio-input-config`
* [x] create graphics for the input channels on the side of the object
* [ ] multiple input channels?

## `graphical-audio-output-config`
* [x] when clicked creates a connection box
* [x] when the connection box dragmove ends find the closest entry and connect the synth
* [x] then emit the details about the connection to parent app which will record them in the cache
  * [x] re-create the connections on load
* [x] draw a line from the source to the connected, have movable know about it, append the a-lines with a class you can select, then query the list of audio connections for the names of the entities to update the targets of the lines with on drag

## refactor to use presets and vue lists
* [x] Filter
* [x] Analyser
* [x] EQ3 with Volume
* [x] Gain
* [x] Master Outputs
* [x] LFO
* [x] DuoSynth
* [x] Sequencer
