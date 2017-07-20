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

# registry cache
* [x] record scene by grabbing the preset and position of the elements
* [x] store scene in cache
* [x] load scene from cache if found
* [ ] CreatorNode
* [x] save scene node
* [x] load scene node

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
* [ ] the movable component doesn't set the p value of the vue instance data which causes the positions to reset to their original spawn position when new things are added because vue reads the unudpated p value and thinks things are busted
  * [NO] remove vue based position management of the node, assign a position prop and emit an event to set the object3d of the element
  * [ ] vue can't handle this shit, it keeps remounting the elements when adding a new one
  * [ ] figure out how the reactivity is happening
