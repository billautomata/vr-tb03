import {EventBus} from '../event-bus.js'

AFRAME.registerComponent('graphical-audio-input-config', {
  init: function () {
    console.log('loaded graphical-audio-input-config')
    var inputBox = document.createElement('a-box')
    inputBox.setAttribute('id', 'input-element')
    inputBox.setAttribute('class', 'input-connector-element')
    inputBox.setAttribute('position', '0 -0.2 0')
    inputBox.setAttribute('scale', '0.1 0.2 0.1')
    inputBox.setAttribute('color', 'green')
    this.el.appendChild(inputBox)
  },
  tick: function(){
    return
  }
});

AFRAME.registerComponent('graphical-audio-output-config', {
  init: function () {
    console.log('loaded graphical-audio-output-config')
    var self = this
    var createConnectorBox = document.createElement('a-box')
    createConnectorBox.setAttribute('position', '-0.1 -0.1 0')
    createConnectorBox.setAttribute('scale', '0.2 0.1 0.1')
    createConnectorBox.setAttribute('color', 'orange')
    this.el.appendChild(createConnectorBox)
    createConnectorBox.addEventListener('click', function () {
      console.log('clicked')
      var outputBox = document.createElement('a-entity')
      console.log(self.el.object3D.position, self.el.object3D.getWorldPosition())
      var p = self.el.object3D.getWorldPosition()
      console.log('creating audio output connector node from ', self.el.getAttribute('name'), self.el.getAttribute('id'))
      outputBox.setAttribute('position', [p.x,p.y,p.z].join(' '))
      outputBox.setAttribute('outputName', self.el.getAttribute('name'))
      outputBox.setAttribute('outputType', self.el.getAttribute('id'))
      outputBox.setAttribute('connector', '')
      document.querySelector('a-scene').appendChild(outputBox)
    })
  },
  tick: function(){
    return
  }
});

AFRAME.registerComponent('connector', {
  init: function () {
    var self = this
    var m = self
    console.log('loaded connector')
    var connectorBox = document.createElement('a-box')
    connectorBox.setAttribute('position', '0 0 0')
    connectorBox.setAttribute('color', 'white')
    connectorBox.setAttribute('click-drag', '')
    this.box = connectorBox
    this.closest = {}

    function dragmove (event) {
      var o = document.querySelectorAll('a-box.input-connector-element')
      // console.log(self.el.parentEl)
      var closest_v = 1024.0
      var closest = {}
      console.log('--')
      o.forEach(function (r) {
        // console.log(self.box.object3D.position)
        var d = self.box.object3D.getWorldPosition().distanceTo(r.object3D.getWorldPosition())
        console.log(d)
        if(d < closest_v){
          closest_v = d
          closest = r.parentEl
        }
      })
      self.closest = closest
      console.log('closest', closest.getAttribute('name'))
    }
    function dragend (event) {
      console.log('dragend called')
      console.log('connecting', self.el.getAttribute('outputName'), self.el.getAttribute('outputType'), 'to', self.closest.getAttribute('name'), self.closest.getAttribute('id'))
      var id = self.closest.getAttribute('id')
      var name = self.closest.getAttribute('name')
      var outputType = self.el.getAttribute('outputType')
      var outputName = self.el.getAttribute('outputName')
      document.querySelectorAll('a-entity#' + id).forEach(function (o) {
        if (o.getAttribute('name') === name) {
          console.log(o.synth)
          document.querySelectorAll('a-entity#' + outputType).forEach(function (r) {
            if (r.getAttribute('name') === outputName) {
              console.log('connecting', r.synth, 'to', o.synth)
              EventBus.$emit('audio-connection', {
                to: {
                  type: id,
                  name: name
                },
                from: {
                  type: outputType,
                  name: outputName
                }
              })
              r.synth.connect(o.synth)
              connectorBox.removeEventListener('dragmove', dragmove)
              connectorBox.removeEventListener('dragend', dragend)
              self.el.removeChild(connectorBox)
            }
          })
        }
      })
    }

    connectorBox.addEventListener('dragmove', dragmove)
    connectorBox.addEventListener('dragend', dragend)
    this.el.appendChild(connectorBox)
  },
  tick: function(){
    // find the closest element
    // console.log(o)
    return
  }
});
