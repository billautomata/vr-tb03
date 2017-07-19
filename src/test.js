/* eslint-env browser */
// var test = require('tape')
module.exports = function (vueInstance) {
  var Tone = window.Tone
  console.log('test.js loaded')

  window.filters.push({
    frequency: 7777,
    Q: 10,
    type: 'lowpass',
    p: { x: 2, y: 0, z: 0 }
  })

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

  window.eq3s.push({
    low: 0,
    mid: 0,
    high: 0,
    volume: 1,
    lowFrequency: 200,
    highFrequency: 2500,
    p: { x: 0, y: 0, z: 0 }
  })

  window.gains.push({
    gain: 1,
    p: { x: 0, y: -1.1, z: 0 }
  })

  window.volumes.push({
    volume: 0,
    mute: false,
    p: { x: 0, y: 1.1, z: 0 }
  })

  window.lfos.push({
    min: -100,
    max: 100,
    amplitude: 1,
    frequency: '16n',
    p: { x: -3, y: 1.1, z: 0 }
  })

  window.duosynths.push({
    p: { x: -5.1, y: 1.1, z: 0 }
  })

  window.sequencers.push({
    p: { x: -5.1, y: -2, z: 0 }
  })

  // test tone
  // vueInstance.$nextTick(function () {
  //   var osc = new Tone.Oscillator()
  //   osc.set('frequency', 120)
  //   osc.set('type', 'square')
  //   osc.set('volume', -10)
  //   console.log('osc', document.querySelector('a-entity#filter'))
  //   osc.connect(document.querySelector('a-entity#filter').synth)
  //   osc.start()
  //   // read meter
  //   var meter = new Tone.Meter('level')
  //   meter.receive('test-out')
  //
  //   window.meter = meter
  //
  //   document.querySelector('a-entity#analyser').synth.connect(meter)
  //
  //   // save presets
  //   // document.querySelector('a-entity#filter').getAttribute('name')
  //   // document.querySelector('a-entity#filter').__vue__.getPresetValuesFromVueInstance()
  //   // document.querySelector('a-entity#filter').object3D.position
  //
  //   // run tests
  //   // test('audio-input-channel-connector works, audio-output-channel-selector works', function (t) {
  //   //   t.plan(1)
  //   //   console.log('meter get value', meter.get('value'))
  //   //   t.notEqual(meter.get('value').value, 0.0)
  //   // })
  // })
}
