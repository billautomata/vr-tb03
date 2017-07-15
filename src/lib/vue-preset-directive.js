import Vue from 'vue'
Vue.directive('presets', {
  bind: function (el, bindings, vnode) {
    setupPresets()
    var data = el.__vue__.$data

    var indicator = document.createElement('a-box')
    indicator.setAttribute('depth', 0.1)
    indicator.setAttribute('width', 0.1)
    indicator.setAttribute('height', 0.1)
    indicator.setAttribute('position', '-0.1 -0.65 0.01')
    indicator.setAttribute('color', 'purple')

    var indicatorSavePreset = document.createElement('a-box')
    indicatorSavePreset.setAttribute('depth', 0.1)
    indicatorSavePreset.setAttribute('width', 0.1)
    indicatorSavePreset.setAttribute('height', 0.1)
    indicatorSavePreset.setAttribute('position', '-0.1 -0.5 0.01')
    indicatorSavePreset.setAttribute('color', 'gold')

    indicatorSavePreset.addEventListener('click', function (event) {
      savePreset(el.__vue__.$data)
    })

    el.appendChild(indicator)
    el.appendChild(indicatorSavePreset)

    var menuDisplayParent = document.createElement('a-entity')
    menuDisplayParent.setAttribute('position', '-0.1 0 0')
    indicator.appendChild(menuDisplayParent)

    indicator.addEventListener('click', function (event) {
      console.log('preset event listener clicked')
      var m = getPresets()[data.registryType]
      console.log(m)
      if (m === undefined || m.length === 0) {
        return
      }
      console.log(menuDisplayParent.children)
      // menuDisplayParent.object3D.visible = menuDisplayParent.object3D.visible
      if (menuDisplayParent.hasChildNodes() === false) {
        console.log('creating child nodes')
        m.forEach(function (preset, index) {
          var presetButton = document.createElement('a-box')
          presetButton.setAttribute('scale', '0.1 0.1 0.1')
          presetButton.setAttribute('position', [ -0.1, (index * 0.11), 0.1 ].join(' '))
          presetButton.setAttribute('color', '#3366FF')
          presetButton.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            console.log('preset', preset)
            el.__vue__.loadPreset(preset)
          })
          menuDisplayParent.appendChild(presetButton)
        })
      }
    })

    // savePreset(el.__vue__.$data)
  },
  inserted: function (el, bindings, vnode) {
    console.log('inserted', el)
    readPresets(el.__vue__.$data, el)
  }
})

function savePreset (data) {
  // console.log('savePreset', data, Object.keys(data).join('\t'))
  if (data.registryType === undefined) {
    // console.log('savePreset called on component that has no registry type assigned in vm.data')
  } else {
    var m = getPresets()
    var o = {}
    Object.keys(data).filter(function (o) { return (o !== 'scales' && o !== 'registryType' && o.slice(0, 1) !== '_') }).forEach(function (p) {
      // console.log('savePreset', p, data[p])
      o[p] = data[p]
    })
    if (m[data.registryType] === undefined) {
      m[data.registryType] = []
    }
    if (isClone(o, m[data.registryType]) === false) {
      m[data.registryType].push(o)
      window.localStorage.setItem('presets', JSON.stringify(m))
    } else {
      // console.log('savePreset - is Clone!', o)
    }
  }
}

function getPresets () {
  return JSON.parse(window.localStorage.getItem('presets'))
}

function readPresets (data, el) {
  var localPresets = getPresets()[data.registryType]
  if (localPresets !== undefined && localPresets.length !== 0) {
    el.__vue__.loadPreset(localPresets.pop())
  }
}

function setupPresets () {
  var k = window.localStorage.getItem('presets')
  if (k === null) {
    window.localStorage.setItem('presets', JSON.stringify({}))
    return setupPresets()
  } else {
    try {
      k = JSON.parse(k)
    } catch (e) {
      window.localStorage.removeItem('presets')
      return setupPresets()
    }
  }
  // console.log('savePreset setupPresets correctly', k)
}

function isClone (a, array) {
  var clone = false
  var clonesFound = 0
  array.forEach(function (b) {
    var allMatch = true
    Object.keys(a).forEach(function (n) {
      if (a[n] !== b[n]) {
        allMatch = false
      }
    })
    if (allMatch === true) {
      clonesFound += 1
    }
  })
  if (clonesFound !== 0) {
    clone = true
  }
  if (array.length === 0) {
    clone = false
  }
  return clone
}
