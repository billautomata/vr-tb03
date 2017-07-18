`audio-input-channel-connector` - specify an input channel, call .receive on that input channel
`audio-output-channel-selector` - specify an output channel, call .send on that output channel

##


## `graphical-audio-input-config`
* [ ] specify available input channels
* [x] create graphics for the input channels on the side of the object

## `graphical-audio-output-config`
* [x] when clicked creates a connection box
* [x] when the connection box dragmove ends find the closest entry and connect the synth
* [ ] then emit the details about the connection to parent app which will record them in the cache
  * [ ] re-create the connections on load
