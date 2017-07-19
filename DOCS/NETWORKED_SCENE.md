## scene descriptions
* query the scene by id for the synthesizers `document.querySelectorAll('a-entity#Sequencer').object3D.userData` and `.position` and `.rotation`
* access the vue element from the `.__vue__.$data`
* get presets information from a vue component method `.__vue__.getPresetValuesFromVueInstance()`
* get the positions of the elements - `document.querySelectorAll('a-entity#mixer').forEach(function(o){console.log(o.object3D.getWorldPosition())})`
* get the proper `.name` of the synth to use in the connection registry setup, get it from the name Attribute on the DOM element
* create a registry of connections to run after the scene loads `filter_349839d9` connects to `channel: 0` or `channel: distortion`
  * find them again by running the querySelectorAll on the registryType

# save / load scene

* function that reads the scene given `document.querySeletorAll('#registryType')` queries and polls the state of the dom to collect
  * object3D position
  * __vue__.getPresetValuesFromVueInstance() to get preset data
* create array of scene objects
* combine the scene objects and the list of connections to create the scene description
* load the scene by iterating over the description array and creating new elements of the type (filter/eq3/etc) and using the save preset as the initial preset for pushing on the vue array.  

## network scene

* when there is an incoming message, flip a flag on the synth instance that is checked in the emit routine, if the flag is off it won't rebroadcast settings when loading the preset, turn it back on after setting the values 

### performance mode
