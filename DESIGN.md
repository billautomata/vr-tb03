## major design changes to the internal api
Move away from having vue observe the data on the Tone objects and do a .get()/.set() in the vue update function.  Tie the slider to the vue data, but specifically do not observe the synth, or register the synth in a global object and tie to a UUID generated in the vue instance

* [x] `self.el.object3D.userData.synth = synth`
  * [x] setFrequency ...
    * `self.frequency = scales['frequency'](event.detail.value)`
    * `self.el.object3D.userData.synth.set('frequency', scales['frequency'](event.detail.value))`

# LFO
* [x] meter/indicator
* [x] level-indicator-component needs to have an internal scale schema
* [x] registry of lfo inputs + connector
* [x] knobs for mix, max
* [x] frequency knob
* [x] start/stop
* [x] lfo indicator component, zero centered
* [ ] when disconnecting the lfo send an event to the synth to reset the target value of the field being LFO'd
  * if you don't reset the value on the synth side it will remain at whatever the lfo was at the last time

# synths
* [ ] rebuild monosynth
* [ ] fm synth
* [ ] metal synth 

# global transport
* [ ] tempo control
* [ ] sequencers are driven by a count from zero to 128 and increment the internal step based on the divisor setting

# sequencer
* [x] note - slider
* [x] rest - toggle
* [x] transpose slider
* [x] randomize patterns
* [ ] start / stop toggle
* [ ] midi output channel select
* [ ] pattern begin step
* [ ] pattern end step

# audio channel selector component
* [ ] refresh list when open
* [ ] indicate which ones are connected, multiple connections are possible
* [ ] check for an array of channels, fan out to them

# slider / butan
> A visual element that is locked on 2 dimensions and limited in the remaining

* user set properties: initialValue
* events: changed (value was changed), override (set value [0,1])

# synth
* [x] oscillator select
* [x] ADSR
* [x] filter
* [ ] presets

# sampler
* [x] basic

# mixer
* [x] basic mixer
* [x] level meters
* [ ] more extensible
  * [x] name channels using mixer name
  * [ ] eq controls

# save configuration
* [ ] instruments, effects

# drum machine
* [ ] synth sources!!!
* [x] poly step sequencer
* [ ] sampler

# sample library
* [ ] list of samples
* [ ] grab tape
* [ ] load in to sampler object

```html
<a-entity inputChannelName='filter1' audio-output-channel-selector='initialValue: auto;'></a-entity>
```
