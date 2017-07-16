## scene descriptions
* query the scene by id for the synthesizers `document.querySelectorAll('a-entity#Sequencer').object3D.userData` and `.position` and `.rotation`
* access the vue element from the `.__vue__.$data`
* get presets information from a vue component method `.__vue__.getPresetValuesFromVueInstance()`
* get the positions of the elements - `document.querySelectorAll('a-entity#mixer').forEach(function(o){console.log(o.object3D.getWorldPosition())})`
* get the proper `.name` of the synth to use in the connection registry setup, get it from the name Attribute on the DOM element
* create a registry of connections to run after the scene loads `filter_349839d9` connects to `channel: 0` or `channel: distortion`
  * find them again by running the querySelectorAll on the registryType

# networked scene

* function that reads the scene given `document.querySeletorAll('#registryType')` queries and polls the state of the dom to collect
  * object3D position
  * __vue__.getPresetValuesFromVueInstance() to get preset data
* create array of scene objects
* combine the scene objects and the list of connections to create the scene description
