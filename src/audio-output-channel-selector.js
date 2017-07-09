// component that allows for configuring
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

    if(this.data.channel === 'auto'){
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
      // list each avaialble channel
      // if any of them are clicked disconnect the synth and connect it to that channel
    })

    function auto_connect (channel) {
      if(channel === undefined){
        window.channels.forEach(function (c,idx){
          if(c.used === undefined && self.connected === false){
            console.log('connecting')
            c.used =  true
            self.connected = true
            self.el.object3D.userData.synth.send(c.channel_name)
          }
        })
      } else {
        self.el.object3D.userData.synth.send(window.channels[Number(channel)].channel_name)
      }
    }

    self.el.appendChild(indicator)

  },
  tick: function () {
    return
  },
  update: function () {
    console.log('audio output channel selector update')
    console.log(this.el.object3D.userData.synth)
  }
})

import Vue from 'vue'
Vue.directive('audio-output-channel-selector', {
  inserted: function (el, bindings, vnode) {
    // console.log(vnode)
    // var synth = vnode.$data
    // console.log('VUE audio output channel selector inserted')
    // console.log(synth)
  }
})
