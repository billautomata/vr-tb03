import Vue from 'vue'
Vue.directive('presets', {
  inserted: function (el, bindings, vnode) {

  },
  bind: function (el, bindings, vnode) {
    window.el = el
    window.bindings = bindings
    window.vnode = vnode
    console.log('bind', el.__vue__.$data)
    console.log(Object.keys(el.__vue__.$data))
    window.q = el.__vue__
    setupPresets()
    savePreset(el.__vue__.$data)
  }
})

function savePreset (data) {
  // console.log('savePreset', data, Object.keys(data).join('\t'))
  if (data.registryType === undefined) {
    // console.log('savePreset called on component that has no registry type assigned in vm.data')
  } else {
    var m = getPresets()
    var o = {}
    Object.keys(data).filter(function (o) { return (o !== 'scales' && o !== 'registryType') }).forEach(function (p) {
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

function isClone (a,array) {
  var clone = false
  var clones_found = 0
  // console.log('savePreset array', array)
  var all_match = true

  array.forEach(function (b) {
    var all_match = true
    Object.keys(a).forEach(function (n) {
      if (a[n] !== b[n]) {
        // console.log('savePreset setting all_match to false')
        all_match = false
      }
    })
    if (all_match === true) {
      clones_found += 1
    }
  })
  if (clones_found !== 0) {
    // console.log('savePreset setting clone to true because clonse found is not zero, ', clones_found)
    clone = true
  }
  if (array.length === 0) {
    // console.log('savePreset setting cloen to false because array.length = 0')
    clone = false
  }

  // console.log('savePreset returning', clone)
  return clone
}
