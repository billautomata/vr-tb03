## major design changes to the internal api
Move away from having vue observe the data on the Tone objects and do a .get()/.set() in the vue update function.  Tie the slider to the vue data, but specifically do not observe the synth, or register the synth in a global object and tie to a UUID generated in the vue instance

## api design
* [ ] write a document for how to create a synth module, the required fields and methods and events
  * [ ] scales & slider initialization
  * [ ] toggle buttons
  * [ ] `setSlider` and the vue instance data with nested fields - `synth.oscillator.detune` `synth.voice0.oscillator.detune`
  * [ ] assign the `synth` object to the `object3D.userData.synth` field
  * [ ] `loadPresets` vue instance methods
  * [ ] emitting events to the global registry, synth, audio output

* [x] `self.el.object3D.userData.synth = synth`
  * [x] setFrequency ...
    * `self.frequency = scales['frequency'](event.detail.value)`
    * `self.el.object3D.userData.synth.set('frequency', scales['frequency'](event.detail.value))`

# presets
* [x] presets with vue directives, setting the value of the vm.$data when using the slider sets the values !!!!!!!
* [x] save preset to local storage
* [x] check for clones by value and registry type
* [x] add ui for loading and saving presets
  * [ ] delete saved preset  ui
  * [ ] event on the menu indicator to append a new child if a preset is saved, live update
* [x] load presets
* [ ] flag to decide to load preset if found
* [ ] non vr preset viewer and editor, names, values, etc

# LFO
* [x] meter/indicator
* [x] level-indicator-component needs to have an internal scale schema
* [x] registry of lfo inputs + connector
* [x] knobs for mix, max
* [x] frequency knob
* [x] start/stop
* [x] lfo indicator component, zero centered
* [ ] range selector for multiplier for min max, [-1,1] or [-10,10] or [-100,100] or [-1000,1000]
* [ ] when disconnecting the lfo send an event to the synth to reset the target value of the field being LFO'd
  * if you don't reset the value on the synth side it will remain at whatever the lfo was at the last time

# synths
* [ ] rebuild monosynth
* [ ] fm synth
* [ ] metal synth
* [x] DuoSynth
* [x] raw PolySynth
  * [ ] expandable polysynth with rows you can put whatever in

# global transport
* [ ] tempo control
* [ ] sequencers are driven by a count from zero to 128 and increment the internal step based on the divisor setting

# chord progression sequencer
* [ ] choose a key/style, slider picks a chord

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
* [ ] check for an array of channels specified on initial value, fan out to them

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

# save global configuration
* [ ] instruments, effects, connections (lfo, audio)

# drum machine
* [ ] synth sources!!!
* [x] poly step sequencer
* [ ] sampler

# sample library
* [ ] list of samples
* [ ] grab tape
* [ ] load in to sampler object, click and drag to drum machine sampler input
