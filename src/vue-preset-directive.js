import Vue from 'vue'
Vue.directive('presets', {
  inserted: function (el, bindings, vnode) {
    console.log('presets!')
    console.log(vnode)
    // var synth = vnode.$data
    // console.log('VUE audio output channel selector inserted')
    // console.log(synth)
    window.vm = this.vm
  },
  bind: function (el, bindings, vnode) {
    window.el = el
    window.bindings = bindings
    window.vnode = vnode
    console.log('bind', el.__vue__.$data)
    console.log('bind', bindings, el.dataset)
  }
})
