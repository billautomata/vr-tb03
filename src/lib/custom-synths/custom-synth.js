module.exports = function (Tone) {
  'use strict'

  Tone.CustomSynth = function (options) {
    options = this.defaultArg(options, Tone.CustomSynth.defaults)
    Tone.Monophonic.call(this, options)

    this.oscillator = new Tone.OmniOscillator(options.oscillator)
    this.oscillator2 = new Tone.OmniOscillator(options.oscillator2)

    this.lfo_osc = new Tone.LFO({
      min: -100,
      max: 100,
      frequency: '4n',
      type: 'square'
    })
    this.lfo_osc.start()
    this.lfo_osc.connect(this.oscillator2.detune)

    this.frequency = this.oscillator.frequency

    this.detune = this.oscillator.detune

    this.envelope = new Tone.AmplitudeEnvelope(options.envelope)

    this.oscillator.chain(this.envelope, this.output)
    this.oscillator2.chain(this.envelope, this.output)

    this.oscillator.start()
    this.oscillator2.start()
    this._readOnly(['oscillator', 'frequency', 'detune', 'envelope'])
  }

  Tone.extend(Tone.CustomSynth, Tone.Monophonic)

  Tone.CustomSynth.defaults = {
    'oscillator': {
      'type': 'square'
    },
    'oscillator2': {
      'type': 'square',
      'detune': -550
    },
    'envelope': {
      'attack': 0.005,
      'decay': 0.1,
      'sustain': 0.3,
      'release': 1
    }
  }

  Tone.CustomSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
    this.envelope.triggerAttack(time, velocity)
    return this
  }

  Tone.CustomSynth.prototype._triggerEnvelopeRelease = function (time) {
    this.envelope.triggerRelease(time)
    return this
  }

  Tone.CustomSynth.prototype.dispose = function () {
    Tone.Monophonic.prototype.dispose.call(this)
    this._writable(['oscillator', 'frequency', 'detune', 'envelope'])
    this.oscillator.dispose()
    this.oscillator = null
    this.envelope.dispose()
    this.envelope = null
    this.frequency = null
    this.detune = null
    this.lfo_osc.dispose()
    this.lfo_osc = null
    return this
  }

  return Tone.CustomSynth
}
