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
    var self = this
    this.connected = false
    this.clickedOpen = false
    var indicator = document.createElement('a-box')
    self.indicator = indicator
    indicator.setAttribute('depth', 0.1)
    indicator.setAttribute('width', 0.1)
    indicator.setAttribute('height', 0.1)
    indicator.setAttribute('position', '0 0 0.01')
    indicator.setAttribute('color', 'blue')
    if (this.data.channel === 'auto') {
      auto_connect()
    } else {
      auto_connect(this.data.channel)
    }
    var display_parent = document.createElement('a-entity')
    display_parent.setAttribute('position', '-0.1 0 0.25')

    indicator.addEventListener('click', function (evt) {
      evt.preventDefault()
      console.log(evt)
      console.log('click', display_parent.children.length)
      self.clickedOpen = !self.clickedOpen
      if (self.clickedOpen === false) {
        display_parent.object3D.visible = false
      } else {
        console.log('here, open')
        if (display_parent.children.length === 0) {
          var back = document.createElement('a-box')
          back.setAttribute('width', 1)
          back.setAttribute('height', 1)
          back.setAttribute('depth', 0.05)
          back.setAttribute('position', '-0.5 -0.4 -0.05')
          display_parent.appendChild(back)
          // first time open, add the boxes
          console.log('creating box elements')
          window.channels.forEach(function (c, channelIndex) {
            var o = document.createElement('a-box')
            o.setAttribute('depth', 0.1)
            o.setAttribute('width', 0.1)
            o.setAttribute('height', 0.1)
            o.setAttribute('position', [ -0.15, -channelIndex * 0.11, 0 ].join(' '))
            o.setAttribute('color', 'green')
            var t = document.createElement('a-text')
            t.setAttribute('value', c.channel_name)
            t.setAttribute('align', 'right')
            t.setAttribute('color', 'black')
            t.setAttribute('scale', '0.5 0.5 0.5')
            t.setAttribute('position', '-0.07 0 0')
            o.appendChild(t)
            display_parent.appendChild(o)
            o.addEventListener('click', function () {
              console.log('channel clicked')
              console.log(c.channel_name)
              self.el.object3D.userData.synth.disconnect()
              self.el.object3D.userData.synth.send(c.channel_name)
            })
          })
        } else {
          // second time open, just make it visible
          display_parent.object3D.visible = true
        }
      }

    })

    function auto_connect (channel) {
      if (Number.isNaN(Number(channel))) {
        self.el.object3D.userData.synth.send(channel)
      } else {
        if (channel === undefined) {
          window.channels.forEach(function (c, idx) {
            if (c.used === undefined && self.connected === false) {
              console.log('connecting', self.el.object3D.userData.synth, 'to', c.channel_name)
              c.used = true
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
    self.el.appendChild(display_parent)
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
