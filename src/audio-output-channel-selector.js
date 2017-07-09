// component that allows for configuring audio output channel by index number or name
AFRAME.registerComponent('audio-output-channel-selector', {
  schema: {
    channel: {
      type: 'string',
      default: 'auto'
    }
  },
  init: function () {
    console.log('audio output channel selector')
    console.log(this.data)
    console.log(this)
    // append a button to the
    var self = this
    var indicator = document.createElement('a-box')
    self.indicator = indicator
    window.m = self
    // console.log('indicator', self.indicator)
    indicator.setAttribute('depth', 0.1)
    indicator.setAttribute('width', 0.1)
    indicator.setAttribute('height', 0.1)
    indicator.setAttribute('position', '0 0 0.01')
    indicator.setAttribute('color', 'blue')

    console.log('audio channels', window.channels)

    this.connected = false
    this.clickedOpen = false

    if (this.data.channel === 'auto') {
      auto_connect()
    } else {
      auto_connect(this.data.channel)
    }

    indicator.addEventListener('click', function (evt) {
      self.clickedOpen = !self.clickedOpen
      console.log('synth', self.el.object3D.userData.synth)
      // self.el.object3D.userData.synth.disconnect()
      console.log(indicator, self.clickedOpen)
      window.indicator = indicator

      window.channels.forEach(function (c, channelIndex) {
        var o = document.createElement('a-box')
        o.setAttribute('depth', 0.1)
        o.setAttribute('width', 0.1)
        o.setAttribute('height', 0.1)
        o.setAttribute('position', [ -0.15, -channelIndex * 0.11, 0 ].join(' '))
        o.setAttribute('color', 'green')
        indicator.appendChild(o)
        o.addEventListener('click', function () {
          console.log('channel clicked')
          self.el.object3D.userData.synth.disconnect()
          self.el.object3D.userData.synth.send(c.channel_name)
        })
      })

      // list each avaialble channel
      // if any of them are clicked disconnect the synth and connect it to that channel
    })

    function auto_connect (channel) {
      if (Number.isNaN(Number(channel))) {
        self.el.object3D.userData.synth.send(channel)
      } else {
        if(channel === undefined){
          window.channels.forEach(function (c,idx){
            if(c.used === undefined && self.connected === false){
              console.log('connecting', self.el.object3D.userData.synth, 'to', c.channel_name)
              c.used =  true
              self.connected = true
              self.el.object3D.userData.synth.send(c.channel_name)
            }
          })
        } else {
          console.log('connecting', self.el.object3D.userData.synth, 'to', Number(channel), window.channels[Number(channel)].channel_name)
          window.channels[Number(channel)].used = true
          self.connected = true
          self.el.object3D.userData.synth.send(window.channels[Number(channel)].channel_name)
        }
      }
    }

    self.el.appendChild(indicator)

  },
  tick: function () {
    return
  },
  update: function () {
    // console.log('audio output channel selector update')
    // console.log(this.el.object3D.userData.synth)
  }
})

// import Vue from 'vue'
// Vue.directive('audio-output-channel-selector', {
//   inserted: function (el, bindings, vnode) {
//     // console.log(vnode)
//     // var synth = vnode.$data
//     // console.log('VUE audio output channel selector inserted')
//     // console.log(synth)
//   }
// })
