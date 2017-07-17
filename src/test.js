/* eslint-env browser */
module.exports = function (vueInstance) {
  var Tone = window.Tone
  console.log('test.js loaded')

  console.log(window.filters)

  var o = {
    frequency: 7777,
    Q: 10,
    type: 'lowpass',
    name: 'filter - lowpass',
    inputChannel: 'filter',
    outputChannel: 'filterOutput',
    p: { x: 0, y: 0, z: 0 }
  }
  window.filters.push(o)

  // var filter = document.createElement('filterf')
  // filter.setAttribute('v-presets', '')
  // filter.setAttribute('movable', '')
  // filter.setAttribute('name', 'filter one')
  // filter.setAttribute('audio-input-channel-connector', 'channel: filter;')
  // filter.setAttribute('audio-output-channel-selector', 'channel: 0;')
  //
  // window.z = filter
  // document.querySelector('a-entity#testTarget').appendChild(filter)
  //
  // setTimeout(function () {
  //   console.log(document.querySelector('#filter'))
  // },100)

  var osc = new Tone.Oscillator()
  osc.send('filter')
  osc.set('frequency', 120)
  osc.set('type', 'square')
  osc.set('volume', -10)
  osc.start()
}
