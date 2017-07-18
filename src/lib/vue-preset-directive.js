import Vue from 'vue'
Vue.directive('presets', {
  bind: function (el, bindings, vnode) {
    setupPresets()
    var data = el.__vue__.$data

    var indicator = document.createElement('a-box')
    indicator.setAttribute('depth', 0.1)
    indicator.setAttribute('width', 0.1)
    indicator.setAttribute('height', 0.1)
    indicator.setAttribute('position', '0 -0.65 0.01')
    indicator.setAttribute('color', 'purple')

    var indicatorSavePreset = document.createElement('a-box')
    indicatorSavePreset.setAttribute('depth', 0.1)
    indicatorSavePreset.setAttribute('width', 0.1)
    indicatorSavePreset.setAttribute('height', 0.1)
    indicatorSavePreset.setAttribute('position', '0 -0.8 0.01')
    indicatorSavePreset.setAttribute('color', 'gold')

    indicatorSavePreset.addEventListener('click', function (event) {
      event.preventDefault()
      event.stopPropagation()
      savePreset(el.__vue__.$data)
      populatePresets()
    })

    el.appendChild(indicator)
    el.appendChild(indicatorSavePreset)

    var menuDisplayParent = document.createElement('a-entity')
    menuDisplayParent.setAttribute('position', '-0.11 0 0.05')
    indicator.appendChild(menuDisplayParent)

    indicator.addEventListener('click', function (event) {
      event.preventDefault()
      event.stopPropagation()
      populatePresets()
    })

    el.__vue__.loadPreset = loadPresetDataToVueInstance
    el.__vue__.getPresetValuesFromVueInstance = function () {
      return getPresetValuesFromVueInstance(el.__vue__.$data)
    }

    function populatePresets () {
      menuDisplayParent.innerHTML = ''
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
          presetButton.setAttribute('position', [ 0, (index * 0.11), 0 ].join(' '))
          presetButton.setAttribute('color', '#3366FF')
          presetButton.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            console.log('preset', preset)
            loadPresetDataToVueInstance(el.__vue__, preset)
          })
          var deleteButton = document.createElement('a-box')
          deleteButton.setAttribute('scale', '0.8 0.8 0.8')
          deleteButton.setAttribute('position', '-1.1 0 0')
          deleteButton.setAttribute('color', 'red')
          deleteButton.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            console.log('delete preset', preset)
            deletePreset(data.registryType, index, populatePresets)
          })
          presetButton.appendChild(deleteButton)
          menuDisplayParent.appendChild(presetButton)
        })
      }
    }

    // savePreset(el.__vue__.$data)
  },
  inserted: function (el, bindings, vnode) {
    // console.log('inserted', el)
    readPresets(el.__vue__.$data, el)
  }
})

function getPresetValuesFromVueInstance (vueInstanceData) {
  var r = {}
  Object.keys(vueInstanceData).filter(function (o) { return (o !== 'scales' && o !== 'registryType' && o.slice(0, 1) !== '_') }).forEach(function (p) {
    r[p] = vueInstanceData[p]
  })
  return r
}

function deletePreset (registryType, presetIndex, populatePresets) {
  console.log('got asked to delete preset', registryType, presetIndex)
  var p = getPresets()
  var m = p[registryType]
  if (m === undefined) {
    return
  }
  console.log(m[presetIndex])
  console.log(m.length, p[registryType].length)
  m.splice(presetIndex, 1)
  console.log(m.length, p[registryType].length)
  window.localStorage.setItem('presets', JSON.stringify(p))
  populatePresets()
}

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

function loadPresetDataToVueInstance (vueInstance, preset) {
  console.log('running load preset from vue preset directive')
  // iterate over the keys of the data and pull the information from the preset
  // Object.keys(vueInstance.$data).filter(function (o) { return (o !== 'scales' && o !== 'registryType' && o.slice(0, 1) !== '_') }).forEach(function (p) {
  //   console.log(p)
  //   vueInstance.$data[p] = JSON.parse(JSON.stringify(preset[p]))
  // })
  // iterate over the preset data and put the values on the data
  Object.keys(preset).forEach(function (n) {
    var v = preset[n]
    vueInstance.$data[n] = JSON.parse(JSON.stringify(v))
  })
}

function getPresets () {
  return JSON.parse(window.localStorage.getItem('presets'))
}

function readPresets (data, el) {
  var localPresets = getPresets()[data.registryType]
  if (localPresets !== undefined && localPresets.length !== 0) {
    console.log('found a preset for ', data.registryType, localPresets[0])
    el.__vue__.loadPreset(el.__vue__, localPresets.pop())
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
