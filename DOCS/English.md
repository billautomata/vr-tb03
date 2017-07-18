`audio-input-channel-connector` - specify an input channel, call .receive on that input channel
`audio-output-channel-selector` - specify an output channel, call .send on that output channel


##


## `graphical-audio-input-config="channel: foo;"`
* specify available input channels
* create graphics for the input channels on the side of the object

`graphical-audio-output`
* when clicked creates a connection box
* when the connection box dragmove ends find the closest entry and connect the synth
* then emit the details about the connection 
