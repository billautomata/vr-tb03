## major design changes to the internal api
Move away from having vue observe the data on the Tone objects and do a .get()/.set() in the vue update function.  Tie the slider to the vue data, but specifically do not observe the synth, or register the synth in a global object and tie to a UUID generated in the vue instance

## scene descriptions
* query the scene by id for the synthesizers `document.querySelectorAll('a-entity#Sequencer').object3D.userData` and `.position` and `.rotation`
* access the vue element from the `.__vue__.$data`
* get presets information from a vue component method `.__vue__.methodName()`
* get the positions of the elements - `document.querySelectorAll('a-entity#mixer').forEach(function(o){console.log(o.object3D.getWorldPosition())})`
* get the proper `.name` of the synth to use in the connection registry setup
* create a registry of connections to run after the scene loads `filter_349839d9` connects to `channel: 0` or `channel: distortion`
  * find them again by running the querySelectorAll on the registryType

## api design
* [x] write a document for how to create a synth module, the required fields and methods and events

# live load
* document.createElement('mixer') ?

# presets vue directive
* [x] presets with vue directives, setting the value of the vm.$data when using the slider sets the values !!!!!!!
* [x] save preset to local storage
* [x] check for clones by value and registry type
* [x] add ui for loading and saving presets
  * [x] button to delete saved preset
  * [x] menuIndicator listens for 'refresh' events
* [x] load presets
* [ ] flag to decide to load preset if found
* [ ] non vr preset viewer and editor, names, values, etc
* [ ] port to an a-frame component?

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
