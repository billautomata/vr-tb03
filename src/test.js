/* eslint-env browser */
var test = require('tape')
module.exports = function (vueInstance) {
  var Tone = window.Tone
  console.log('test.js loaded')
  var testFilter = {
    frequency: 7777,
    Q: 10,
    type: 'lowpass',
    p: { x: 2, y: 0, z: 0 }
  }
  window.filters.push(testFilter)

  window.analysers.push({
    type: 'fft',
    size: 128,
    p: { x: -2, y: 0, z: 0 }
  })

  window.analysers.push({
    type: 'waveform',
    size: 128,
    p: { x: 4, y: 0, z: 0 }
  })


  // test tone
  vueInstance.$nextTick(function (){
    var osc = new Tone.Oscillator()
    osc.set('frequency', 120)
    osc.set('type', 'square')
    osc.set('volume', -10)
    console.log('osc', document.querySelector('a-entity#filter'))
    osc.connect(document.querySelector('a-entity#filter').synth)
    osc.start()
    // read meter
    var meter = new Tone.Meter('level')
    meter.receive('test-out')

    window.meter = meter

    document.querySelector('a-entity#analyser').synth.connect(meter)

    // save presets
    // document.querySelector('a-entity#filter').getAttribute('name')
    // document.querySelector('a-entity#filter').__vue__.getPresetValuesFromVueInstance()
    // document.querySelector('a-entity#filter').object3D.position

    // run tests
    // test('audio-input-channel-connector works, audio-output-channel-selector works', function (t) {
    //   t.plan(1)
    //   console.log('meter get value', meter.get('value'))
    //   t.notEqual(meter.get('value').value, 0.0)
    // })
  })
}
