// component that listens for midi channel messages and triggers the synth
import {EventBus} from '../event-bus.js'

window.AFRAME.registerComponent('midi-input-channel-selector', {
  schema: {
    channel: {
      type: 'string',
      default: 'auto'
    }
  },
  init: function () {
    var self = this
    console.log('loaded midi controller')
    console.log('midi synth target', self.el.synth)
    var c = self.data.channel
    if (c === 'auto') {
      c = '1'
    }
    EventBus.$on(['channel-', c].join(''), function (evt) {
      // console.log('evt', evt)
      if (evt.type === 'poly') {
        self.el.synth.triggerAttackRelease(evt.notes.map(function (o) { return window.Tone.Frequency(o, 'midi') }), '16n', evt.time)
      } else {
        self.el.synth.triggerAttackRelease(window.Tone.Frequency(evt.note, 'midi'), '16n', evt.time)
      }
    })
  },
  tick: function () {
    return
  }
})
