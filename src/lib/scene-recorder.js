module.exports = function sceneRecorder () {
  var types = require('../scene_configuration_defaults.js').types
  // var types = ['filter', 'analyser', 'eq3', 'gain', 'volume', 'lfo', 'duosynth', 'sequencer']
  var sceneElements = []
  types.forEach(function (t) {
    var m = document.querySelectorAll('a-entity#'+t)
    m.forEach(function (element){
      sceneElements.push({
        t: t,
        presets: element.__vue__.getPresetValuesFromVueInstance(),
        position: element.object3D.getWorldPosition()
      })
      console.log(t, element.__vue__.getPresetValuesFromVueInstance(), element.object3D.getWorldPosition())
    })
  })
  console.log(JSON.stringify(sceneElements))
  return JSON.stringify(sceneElements)
}
