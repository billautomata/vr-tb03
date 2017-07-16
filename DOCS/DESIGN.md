## major design changes to the internal api
Move away from having vue observe the data on the Tone objects and do a .get()/.set() in the vue update function.  Tie the slider to the vue data, but specifically do not observe the synth, or register the synth in a global object and tie to a UUID generated in the vue instance

## instantiate type block
* [ ] click block > menu appears > click type 'LFO' > creates the element by putting it on the vue master list

## rewrite components to use new setup for presets, slideSet
* [x] Filter
* [x] Sequencer
* [x] LFO
* [x] DuoSynth
* [ ] Chorus
* [ ] Distortion
* [ ] Freeverb
* [ ] PolySynth
* [ ] Synth
* [o] AutoFilter
* [ ] BitCrusher

## api design
* [x] write a document for how to create a synth module, the required fields and methods and events
* [ ] can this work? store the scales[field].domain([0,1]).range(v) information in the slider attributes for automatic setup! `scaleRange=['highpass', 'lowpass', 'bandpass']; scaleType=quantile;`

# live load
* [x] document.createElement('mixer') works!

# component, audio input channel selector for Effects
> performs the .receive call on the channel name

* [ ] `audio-input-channel-selector="channel: filter"`
* [ ] analog of the output channel selector

# presets vue directive
* [x] presets with vue directives, setting the value of the vm.$data when using the slider sets the values !!!!!!!
* [x] save preset to local storage
* [x] check for clones by value and registry type
* [x] add ui for loading and saving presets
  * [x] button to delete saved preset
  * [x] menuIndicator listens for 'refresh' events
* [x] load presets method assigned to the vue instance
* [ ] flag to decide to load preset if found, or load a preset value by name from the named preset values used in the scene interop lists
* [ ] non vr preset viewer and editor, names, values, etc
* [x] automatically load a preset if found


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
* [ ] listen for .send() events for audio

# drum machine
* [ ] synth sources!!!
* [x] poly step sequencer
* [ ] sampler

# sample library
* [ ] list of samples
* [ ] grab tape
* [ ] load in to sampler object, click and drag to drum machine sampler input
