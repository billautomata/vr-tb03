# rules
* if an instance doesn't have a registry type it won't save the preset but it will add the load preset function to the vue instance
* required attributes:
  * `movable`
  * `v-presets`
  * `name` (the index of the object)
* options attributes:
  * `graphical-audio-input-config`
  * `graphical-audio-output-config`
* more

## new stuff to make
* [ ] sequencer pattern store robot
* [ ] song mode, can spawn and load step sequencer patterns and chain the patterns calling loadPreset with the next sequence when the pattern number is at (n_steps-1)
* [ ] drum machine / sampler
* [ ] midi input channel component
* [ ] Remove Element component
* [ ] Network Transmit Block
* [x] custom synth design pattern example
  * [ ] use it in a module

# weird bugs found
* [ ] save scene needs to handle the connections
* [ ] when a primary broadcasts the configuration to secondary entities, the initialization routine transmits the knob settings, that's unnecessary, control the network transmission toggle with a component on all synths

# disabled things to help with refactoring

## `graphical-audio-input-config`
* [ ] multiple input channels?
