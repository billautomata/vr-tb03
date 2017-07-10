# global transport
* [ ] tempo control
* [ ] sequencers are driven by a count from zero to 128 and increment the internal step based on the divisor setting

# sequencer

* [x] note - slider
* [x] rest - toggle
* [x] transpose slider
* [x] randomize patterns
* [ ] start / stop toggle
* [ ] output channel select
* [ ] pattern begin step
* [ ] pattern end step

# audio channel selector
* [ ] refresh list when open

# slider / butan
> A visual element that is locked on 2 dimensions and limited in the remaining

* user set properties: initialValue
* events: changed (value was changed), override (set value [0,1])

# synth
* [x] oscillator select
* [x] ADSR

# sampler
* [x] basic

# mixer
* [x] basic mixer
* [x] level meters
* [ ] more extensible

# effects
* [x] inputs registering as outputs

# routing matrix

# drum machine
* [ ] step sequencer
* [ ] sampler

# sample library
* [ ] list of samples
* [ ] grab tape
* [ ] load in to sampler object

```html
<a-entity inputChannelName='filter1' audio-output-channel-selector='initialValue: auto;'></a-entity>
```
