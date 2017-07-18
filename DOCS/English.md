`audio-input-channel-connector` - specify an input channel, call .receive on that input channel
`audio-output-channel-selector` - specify an output channel, call .send on that output channel

# rules
* if an instance doesn't have a registry type it won't save the preset but it will add the load preset function to the vue instance
* required attributes: `movable` `v-presets` `name`

## refactor to use presets and vue lists
* [x] Filter
* [x] Analyser
* [ ] Mixer

## `graphical-audio-input-config`
* [x] create graphics for the input channels on the side of the object
* [ ] mulitple input channels?

## `graphical-audio-output-config`
* [x] when clicked creates a connection box
* [x] when the connection box dragmove ends find the closest entry and connect the synth
* [x] then emit the details about the connection to parent app which will record them in the cache
  * [x] re-create the connections on load
* [x] draw a line from the source to the connected, have movable know about it, append the a-lines with a class you can select, then query the list of audio connections for the names of the entities to update the targets of the lines with on drag
