var types = ['filter', 'analyser', 'eq3', 'gain', 'volume', 'lfo', 'duosynth', 'sequencer', 'scalesequencer']

var defaults = {}

defaults.filter = {
  frequency: 7777,
  Q: 1,
  type: 'lowpass'
}

defaults.analyser = {
  type: 'fft',
  size: 128
}

defaults.eq3 = {
  low: 0,
  mid: 0,
  high: 0,
  volume: 1,
  lowFrequency: 200,
  highFrequency: 2500
}

defaults.gain = {
  gain: 1
}

defaults.volume = {
  volume: 0,
  mute: false
}

defaults.lfo = {
  min: -100,
  max: 100,
  amplitude: 1,
  frequency: '1n'
}
defaults.duosynth = {
  vibratoAmount: 0.5,
  vibratoRate: 0.1,
  harmonicity: 1.5,
  voice0: {
    oscillator: {
      type: 'square'
    },
    portamento: 0
  },
  voice1: {
    oscillator: {
      type: 'triangle'
    },
    portamento: 0
  }
}
defaults.sequencer = {
  p: { x: 0, y: 0, z: 0 }
}
defaults.scalesequencer = {
  p: { x: 0, y: 0, z: 0 }
}

module.exports.types = types
module.exports.defaults = defaults
