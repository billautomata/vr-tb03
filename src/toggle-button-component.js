window.AFRAME.registerComponent('butan', {
  schema: {
    initialValue: {
      type: 'boolean',
      default: true
    },
    buttonType: {
      type: 'string',
      default: 'toggle'
    }
  },
  init: function () {
    // console.log('loaded butan', this.data.buttonType)
    var self = this
    var indicator = document.createElement('a-box')
    self.indicator = indicator
    // console.log('indicator', self.indicator)
    indicator.setAttribute('depth', 0.1)
    indicator.setAttribute('width', 0.1)
    indicator.setAttribute('height', 0.1)
    indicator.setAttribute('color', this.data.initialValue ? 'green' : 'red')

    self.el.addEventListener('reset', function () {
      // console.log('reset')
      self.data.initialValue = true
      self.indicator.setAttribute('color', self.data.initialValue ? 'green' : 'red')
    })

    indicator.addEventListener('click', function (evt) {
      self.data.initialValue = !self.data.initialValue
      self.indicator.setAttribute('color', self.data.initialValue ? 'green' : 'red')
      self.el.emit('changed', { value: self.data.initialValue })
      if (self.data.buttonType === 'momentary') {
        self.el.emit('reset', {})
      }
    })
    this.el.appendChild(indicator)
  },
  tick: function () {
  },
  update: function (old) {
    // console.log('update')
    var self = this
    self.indicator.setAttribute('color', this.data.initialValue ? 'green' : 'red')
  }
})
