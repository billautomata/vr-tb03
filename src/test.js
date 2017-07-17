/* eslint-env browser */
module.exports = function (vueInstance) {
  var Tone = window.Tone
  console.log('test.js loaded')

  var testFilter = {
    frequency: 7777,
    Q: 10,
    type: 'lowpass',
    name: 'filter - lowpass',
    inputChannel: 'filter',
    outputChannel: 'filterOutput',
    p: { x: 0, y: 0, z: 0 }
  }
  window.filters.push(testFilter)

  // test tone
  var osc = new Tone.Oscillator()
  osc.send('filter')
  osc.set('frequency', 120)
  osc.set('type', 'square')
  osc.set('volume', -10)
  osc.start()
}
