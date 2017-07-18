/* eslint-env browser */
var test = require('tape')
module.exports = function (vueInstance) {
  var Tone = window.Tone
  console.log('test.js loaded')
  var testFilter = {
    frequency: 7777,
    Q: 10,
    type: 'lowpass',
    name: '1',
    inputChannel: 'filterInput',
    outputChannel: 'filterOutput',
    p: { x: 2, y: 0, z: 0 }
  }
  window.filters.push(testFilter)
  // test tone
  var osc = new Tone.Oscillator()
  osc.set('frequency', 120)
  osc.set('type', 'square')
  osc.set('volume', -10)
  osc.send('filterInput')
  osc.start()
  // read meter
  var meter = new Tone.Meter('level')
  meter.receive('test-out')
  window.meter = meter
  // run tests
  // test('audio-input-channel-connector works, audio-output-channel-selector works', function (t) {
  //   t.plan(1)
  //   console.log('meter get value', meter.get('value'))
  //   t.notEqual(meter.get('value').value, 0.0)
  // })
}
