// component that allows lfos to read the lfo input registry
AFRAME.registerComponent('lfo-output-selector', {
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
    indicator.setAttribute('position', '0 -1.0 0.01')
    indicator.setAttribute('color', 'orange')
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
          back.setAttribute('width', 2.1)
          back.setAttribute('height', 1)
          back.setAttribute('depth', 0.05)
          back.setAttribute('position', '-1.05 -0.4 -0.05')
          display_parent.appendChild(back)
          // first time open, add the boxes
          console.log('creating box elements')
          window.lfo_inputs.forEach(function (c, channelIndex) {
            var o = document.createElement('a-box')
            o.setAttribute('depth', 0.1)
            o.setAttribute('width', 0.1)
            o.setAttribute('height', 0.1)
            o.setAttribute('position', [ -0.15, -channelIndex * 0.11, 0 ].join(' '))
            o.setAttribute('color', 'green')
            var t = document.createElement('a-text')
            t.setAttribute('value', c.name + ' ' + c.field)
            t.setAttribute('align', 'right')
            t.setAttribute('color', 'black')
            t.setAttribute('scale', '0.5 0.5 0.5')
            t.setAttribute('position', '-0.07 0 0')
            o.appendChild(t)
            display_parent.appendChild(o)
            o.addEventListener('click', function () {
              console.log('channel clicked')
              console.log(c.channel_name)
              // self.el.object3D.userData.synth.disconnect()
              if (c.field.indexOf('.') === -1) {
                self.el.object3D.userData.synth.connect(c.synth[c.field])
              } else {
                self.el.object3D.userData.synth.connect(c.synth[c.field.split('.')[0]][c.field.split('.')[1]])
              }
            })
          })
        } else {
          // second time open, just make it visible
          display_parent.object3D.visible = true
        }
      }
    })
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
